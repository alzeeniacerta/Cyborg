import { Base, BaseClass } from "../../helpers/BaseClass";
import { elements } from "../../xpath/platform/workflowPageElements";
import { XPathBuilder } from "../../helpers/util/xpathBuilder";
import {
	capitalizeFirstCharAllWords,
	getDate,
	getDateTime,
	getDigitsFromString,
	capitalizeFirstChar,
} from "../../helpers/util/basic";
import { readExcel } from "../../helpers/util/excel_csv";

export default class WorkflowPage {
	baseInstance: BaseClass;
	ChildWorkflowFieldValues = [];
	tableRowDataForChildWorkflow = [];

	constructor(baseInstance: BaseClass) {
		this.baseInstance = baseInstance;
	}

	async workflowIsOpened(workflowType: string) {
		const workflowName = this.getWorkflowName(workflowType);
		return (
			(await this.baseInstance.isDisplayed(elements.workFlowNameLabel.replace("arg", workflowName))) &&
			(await this.baseInstance.isDisplayed(elements.stepBody))
		);
	}

	async getworkflowID(workflowType: string) {
		const workflowName = this.getWorkflowName(workflowType);
		this.baseInstance.workflowID = getDigitsFromString(
			await this.baseInstance.getText(elements.workFlowNameLabel.replace("arg", workflowName)),
		);
	}

	/**
	 * Returns name of the workflow based on the type
	 * @param workflowType recent ot starred workflow
	 * @returns
	 */
	getWorkflowName(workflowType: string) {
		switch (workflowType.toLowerCase()) {
			case "recent":
				return this.baseInstance.recentWorkflowName;
			case "starred":
				return this.baseInstance.starredWorkflowName;
			case "new":
				return "Draft";
			case "shortcut":
				return "Draft";
			case "waiting on you":
				return this.baseInstance.woyWorkflowName;
			case "requested by you":
				return this.baseInstance.rbyWorkflowName;
			default:
				throw "Please specify 'recent' / 'starred' / 'new' / 'shortcut' / 'waiting on you' / 'requested by you'  worflow type";
		}
	}

	async commentOnWorkflow(user: string, commentType: string) {
		let commentButton = "";
		const comment = commentType + " comment " + getDateTime();
		switch (commentType) {
			case "step":
				commentButton = new XPathBuilder().anyElement().withLabel("Messages").atIndex(2).build();
				await this.baseInstance.clickElement(commentButton, "General comment button");
				break;
			case "field":
				commentButton = new XPathBuilder().anyElement().withLabel("Messages").atIndex(3).build();
				await this.baseInstance.clickElement(commentButton, "Task comment button");
				break;
			case "report" || "dashboard":
				break;
			default:
				throw "Please specify 'general' or 'task' comment";
		}
		const commentInput = new XPathBuilder().textarea().withLabel("mention-input").build();
		await this.baseInstance.enterText(
			commentInput,
			"@" + user,
			"Mentioned user " + user + "in" + commentType + "comment",
		);
		await this.baseInstance.keyboardPress("Enter");
		await this.baseInstance.keyboardType(comment);
		const postButton = new XPathBuilder().anyElement().containsText("Post").build();
		await this.baseInstance.clickElement(postButton, "Post button");
		await this.closeSidePanel();
	}

	async closeSidePanel() {
		const closeButton = new XPathBuilder().span().withLabel("Close").atIndex(1).build();
		await this.baseInstance.clickElement(closeButton, "Close side section");
	}

	async assignStepToUser(user: string) {
		const assignButton = new XPathBuilder().anyElement().containsText("Assign").build();
		await this.baseInstance.clickElement(assignButton, "Assign button");
		const searchUser = new XPathBuilder().div().containsText("Search User").build();
		await this.baseInstance.clickElement(searchUser, "Search user ");
		await this.baseInstance.keyboardType(user);
		await this.baseInstance.keyboardPress("Enter");
		await this.baseInstance.wait(2);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async getStepAssignedUsers(): Promise<string[]> {
		const assignedUsers = new XPathBuilder().anyElement().containsText("ASSIGNED TO").followingSibling().div().build();
		const assignedUsersList = await this.baseInstance.getTextFromAllElements(assignedUsers);
		this.baseInstance.customLog("Assigned users are: " + assignedUsersList);
		return assignedUsersList;
	}

	async clickAllCommentsButton() {
		const allCommentsButton = new XPathBuilder().anyElement().withLabel("Messages").atIndex(1).build();
		await this.baseInstance.clickElement(allCommentsButton, "All comments button");
	}

	async getCommentCount(): Promise<number> {
		await this.baseInstance.wait(2);
		await this.baseInstance.waitForAppLoaderToDisappear();
		const commentCount = await this.baseInstance.getElementCount(elements.commentPanelIcon);
		this.baseInstance.customLog("Total comments are: " + commentCount);
		return commentCount;
	}

	async clickOptionFromWorkflowOptions(option: string) {
		const worflowOptions = new XPathBuilder().anyElement().withLabel("Dots").atIndex(1).build();
		await this.baseInstance.clickElement(worflowOptions, "Workflow options");
		const optionDiv = new XPathBuilder().div().containsText(option).build();
		await this.baseInstance.clickElement(optionDiv, "Option " + option);
		await this.baseInstance.waitForAppLoaderToDisappear();
		await this.clickTabInActivityLog("Views");
		await this.clickTabInActivityLog("Edits");
		await this.clickTabInActivityLog("Emails");
	}

	async clickTabInActivityLog(tab: string) {
		const tabDiv = new XPathBuilder().span().containsText(capitalizeFirstCharAllWords(tab)).atIndex(1).build();
		await this.baseInstance.clickElement(tabDiv, "Tab " + tab);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async waitForLogToAppear(logType: string) {
		Base.logger.info("Waiting for log to appear");
		// await this.baseInstance.wait(5);
		await this.baseInstance.reloadPage();
		await this.baseInstance.waitForAppLoaderToDisappear();
		await this.clickOptionFromWorkflowOptions("View Activity Log");
		await this.clickTabInActivityLog(logType);
	}

	getXPathForLogType(logType: string): string {
		switch (capitalizeFirstCharAllWords(logType)) {
			case "Significant Events":
				return elements.significantEventLogDiv;
			case "Views":
				return elements.viewLogDiv;
			case "Edits":
				return elements.editsLogDiv;
			case "Emails":
				return elements.emailLogDiv;
			default:
				throw new Error("Please specify 'significant events' / 'views' / 'edits' / 'emails' log type");
		}
	}

	async verifyLog(logType: string, log: string, timestamp: string, index: string): Promise<boolean> {
		let xpath: string = "";

		await this.clickTabInActivityLog(logType);
		for (let i = 0; i < 5; i++) {
			xpath = this.getXPathForLogType(logType) + `[${index}]`;
			if (await this.baseInstance.isDisplayed(xpath)) {
				const logText = await this.baseInstance.getTextFromAllElements(xpath);

				if (logText[0].includes(log) && logText[0].includes(timestamp)) {
					return true;
				} else {
					await this.waitForLogToAppear(logType);
				}
			} else {
				console.log("Not displayed " + i);
				await this.waitForLogToAppear(logType);
			}
		}
		return false;
	}

	async enterDataInField(data: string, field: string) {
		await this.baseInstance.enterText(
			elements.workflowFields.replace("arg", field),
			data,
			"Entered " + data + " in " + field,
		);
		await this.baseInstance.keyboardPress("Tab");
	}

	async submitWorkflowStep() {
		const submitButton = new XPathBuilder().anyElement().containsText("Submit").build();
		await this.baseInstance.clickElement(submitButton, "Workflow submit button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async submitChildWorkflowStep() {
		const submitButton = new XPathBuilder().anyElement().containsText("Submit").atIndex(2).build();
		await this.baseInstance.clickElement(submitButton, "Workflow submit button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async editWorkflowStep() {
		const editButton = new XPathBuilder().anyElement().containsText("Edit").build();
		await this.baseInstance.clickElement(editButton, "Workflow submit button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async verifyWorkflowCompleteMessage() {
		const completeMessage = new XPathBuilder()
			.anyElement()
			.containsText("All tasks in this entity have been completed")
			.build();
		return this.baseInstance.isDisplayed(completeMessage);
	}

	async clickonStep(stepName: string) {
		await this.baseInstance.clickElement(elements.stepSpan.replace("arg", stepName), "Step " + stepName);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async workflowIsCompleted() {
		return this.baseInstance.getText(elements.workflowStatus);
	}

	async verifyWorkflowHasStatus() {
		return await this.baseInstance.isDisplayed(elements.workflowStatus);
	}

	async downloadLogs() {
		const logsActionButton = new XPathBuilder()
			.span()
			.containsText("Action")
			.parent()
			.div()
			.followingSibling()
			.button()
			.build();
		await this.baseInstance.clickElement(logsActionButton, "Logs action");
		const downloadLogsButton = new XPathBuilder().anyElement().containsText("Download all").build();

		// Setup wait for event trigger
		const downloadLogsPromise = Base.page.waitForEvent("download");
		await this.baseInstance.clickElement(downloadLogsButton, "Download logs");
		const download = await downloadLogsPromise;

		// Wait for the download process to complete and save the downloaded file somewhere.
		await download.saveAs(this.baseInstance.downloadPath + download.suggestedFilename());
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async verifyDownloadedLogs(fileName: string, table: string[][]) {
		try {
			const worksheet = await readExcel(fileName, 1); // Get first worksheet

			if (this.baseInstance.workflowID != null) {
				// Iterate through the rows to find a match for each row in the table
				for (const row of table) {
					const inputData = {
						WorkflowID: row[0] === "dynamic" ? this.baseInstance.workflowID : "",
						WorkflowName: row[1].toLowerCase(),
						Step: row[2].toLowerCase(),
						Action: row[3].toLowerCase(),
						Username: row[4].toLowerCase(),
						UserEmail: row[5].toLowerCase(),
						Time: getDate(),
						FieldName: row[7].toLowerCase(),
						OldValue: row[8].toLowerCase(),
						NewValue: row[9].toLowerCase(),
						Event: row[10].toLowerCase(),
					};

					let startingRow = 2;
					const endingRow = worksheet.rowCount;
					for (const excelRow of worksheet.getRows(startingRow, endingRow)) {
						const a = excelRow.getCell("A").value;
						const b = excelRow.getCell("B").value;
						const c = excelRow.getCell("C").value;
						const d = excelRow.getCell("D").value;
						const e = excelRow.getCell("E").value;
						const f = excelRow.getCell("F").value;
						const g = excelRow.getCell("G").value;
						const h = excelRow.getCell("H").value;
						const i = excelRow.getCell("I").value;
						const j = excelRow.getCell("J").value;
						const k = excelRow.getCell("K").value;
						if (
							(inputData.WorkflowID == "" ||
								(a != null && a.toString().toLowerCase().includes(inputData.WorkflowID))) &&
							(inputData.WorkflowName == "" ||
								(b != null && b.toString().toLowerCase().includes(inputData.WorkflowName))) &&
							(inputData.Step == "" || (c != null && c.toString().toLowerCase().includes(inputData.Step))) &&
							(inputData.Action == "" || (d != null && d.toString().toLowerCase().includes(inputData.Action))) &&
							(inputData.Username == "" || (e != null && e.toString().toLowerCase().includes(inputData.Username))) &&
							(inputData.UserEmail == "" || (f != null && f.toString().toLowerCase().includes(inputData.UserEmail))) &&
							(inputData.Time == "" || (g != null && g.toString().toLowerCase().includes(inputData.Time))) &&
							(inputData.FieldName == "" || (h != null && h.toString().toLowerCase().includes(inputData.FieldName))) &&
							(inputData.OldValue == "" || (i != null && i.toString().toLowerCase().includes(inputData.OldValue))) &&
							(inputData.NewValue == "" || (j != null && j.toString().toLowerCase().includes(inputData.NewValue))) &&
							(inputData.Event == "" || (k != null && k.toString().toLowerCase().includes(inputData.Event)))
						) {
							Base.logger.info("Match found! Row number: " + startingRow + "");
							Base.logger.info("Matching row:" + excelRow.values);
							break; // Exit the loop if a match is found for this row
						}
						if (startingRow == endingRow) {
							throw new Error("No match found for row: " + row);
						}
						startingRow++;
					}
				}
			} else {
				throw new Error("Workflow ID is null");
			}
		} catch (error) {
			Base.logger.error("Error:", error);
			throw error;
		}
	}

	async verifyChildTable(tablename: string) {
		return this.baseInstance.isDisplayed(elements.childTable.replace("arg", tablename));
	}

	async verifyAddButtomCount(addButtonName: string) {
		await this.baseInstance.wait(5);
		const xpath = new XPathBuilder().span().withText(addButtonName).build();
		return this.baseInstance.getElementCount(xpath);
	}

	async checkTextOnPage(text: string) {
		const xpath = new XPathBuilder().anyElement().withText(text).build();
		return this.baseInstance.isDisplayed(xpath);
	}

	async clickAddButton(addButtonName: string) {
		const xpath = new XPathBuilder().span().withText(addButtonName).atIndex(1).build();
		await this.baseInstance.clickElement(xpath, "Add child workflow button");
		await this.baseInstance.wait(5);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async verifyHeader() {
		return this.baseInstance.isDisplayed(elements.ChildWorkflowSideViewHeader);
	}

	async clickCloseButton() {
		await this.baseInstance.clickElement(elements.sidePanelCloseIcon, "sidePanelCloseIcon");
	}

	async verifyDiscardDialogueBoxVisibility() {
		return this.baseInstance.isDisplayed(elements.discardDialogueBox);
	}

	async clickActionDialogBox(text: string) {
		const xpath = new XPathBuilder().span().withText(text).build();
		await this.baseInstance.clickElement(xpath, text + " button");
	}

	async verifyParentToChildMapping(fieldLabel: string) {
		await this.baseInstance.waitForAppLoaderToDisappear();
		await this.baseInstance.wait(3);
		const text = await this.baseInstance.getHtmlAttributeByXPath(
			elements.workflowFields.replace("arg", fieldLabel),
			"value",
		);
		Base.logger.info("Field Value is" + text + "");
		return text;
	}

	async verifyChildToParentMapping(fieldLabel: string) {
		await this.baseInstance.waitForAppLoaderToDisappear();
		await this.baseInstance.wait(3);
		let text = await this.baseInstance.getHtmlAttributeByXPath(
			elements.workflowFields.replace("arg", fieldLabel),
			"value",
		);
		const allData = text.split("~");
		Base.logger.info(allData);
		Base.logger.info("length" + allData.length);
		text = allData[allData.length - 1];
		Base.logger.info("Field Value is" + text + "");
		return text;
	}

	async getChildtableRowCount() {
		await this.baseInstance.waitForAppLoaderToDisappear();
		const count = await this.baseInstance.getText(elements.childTableRowCount);
		return count;
	}

	async getWorkflowData(workflowName: string) {
		const workflow = new XPathBuilder().span().withText(workflowName).build();
		await this.baseInstance.clickElement(workflow, "workflow name");
		const disabledElements = await this.baseInstance.getAllElements(elements.disabledElements);
		for (let i = 0; i < disabledElements.length; i++) {
			const element = disabledElements[i];
			const fieldValue = await element.getAttribute("value");
			Base.logger.info("Field Values:" + fieldValue);
			this.ChildWorkflowFieldValues.push(fieldValue);
		}
		Base.logger.info("Field Values array:" + this.ChildWorkflowFieldValues);
	}

	async getWorkflowDataFromTable(workflowName: string) {
		this.tableRowDataForChildWorkflow = await this.baseInstance.getTextFromAllElements(
			elements.childTableRowData.replace("arg", workflowName),
		);
		Base.logger.info("Field Values array:" + this.tableRowDataForChildWorkflow);
	}

	async verifyWorkflowData() {
		const areArraysEqual =
			JSON.stringify(this.ChildWorkflowFieldValues) === JSON.stringify(this.tableRowDataForChildWorkflow);
		return areArraysEqual;
	}

	async verifyWorkflowCreation(workflowName: string) {
		const xpath = new XPathBuilder().span().withText(workflowName).build();
		return this.baseInstance.isDisplayed(xpath);
	}

	async clickToSortChildTableField(columnName: string) {
		await this.baseInstance.clickElement(
			elements.childWorkflowTableHeadersSortButton.replace("arg", capitalizeFirstChar(columnName)),
			capitalizeFirstChar(columnName) + " sort",
		);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async verifyChildTableRecordsAreSorted(columnName: string): Promise<boolean> {
		const column = capitalizeFirstChar(columnName);
		let xpath = "";
		if (column == "Name") {
			xpath = elements.childTableAllProcessName;
		} else if (column == "Age") {
			xpath = elements.childTableAllProcessAgeField;
		}

		// Get process names for all rows
		const sortedRows = await this.baseInstance.getAllElements(xpath);
		const rowData = await Promise.all(sortedRows.map((row) => row.textContent()));
		Base.logger.info("Row Data : " + JSON.stringify(rowData));

		// Make a copy and sort
		const sortedCopy = [...rowData];
		sortedCopy.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
		Base.logger.info("Sorted Row Data : " + JSON.stringify(sortedCopy));

		// Check if retrived names and sorted names are equal
		const isSorted = JSON.stringify(rowData) === JSON.stringify(sortedCopy);
		return isSorted;
	}

	async clickFieldFilterButton(field: string) {
		await this.baseInstance.clickElement(
			elements.childWorkflowTableFilterButton.replace("arg", field),
			"Filter button for " + field,
		);
	}

	async enterInFilterAndSearch(ColumnName: string, param: string) {
		const column = capitalizeFirstChar(ColumnName);
		await this.clickFieldFilterButton(column);
		await this.baseInstance.clickElement(
			elements.childWorkflowTableFilterInputField.replace("arg", param),
			"Checkbox for column" + ColumnName + " with value " + param,
		);
		await this.baseInstance.clickOnlyVisibleElement(elements.childWorkflowTableFilterSearchButton, "search icon");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async verifyAppliedFilters(field: string, value: string): Promise<boolean> {
		const column = field.toLowerCase();
		// Result verification
		if (column == "name") {
			const names = await this.baseInstance.getTextFromAllElements(elements.childTableAllProcessName);
			Base.logger.info("Data from name column: " + names);
			if (!names.every((item) => item.toLowerCase().includes(value.toLowerCase()))) {
				return false;
			}
		} else if (column == "namectp") {
			const NameCTPValue = (
				await this.baseInstance.getTextFromAllElements(elements.childTableAllProcessNameCTPField)
			).slice(1);
			Base.logger.info("Data from namectp column: " + NameCTPValue);
			if (!NameCTPValue.every((item) => item.toLowerCase().includes(value.toLowerCase()))) {
				return false;
			}
		} else if (column == "email") {
			const emailValue = (
				await this.baseInstance.getTextFromAllElements(elements.childTableAllProcessEmailField)
			).slice(1);
			Base.logger.info("Data from email column: " + emailValue);
			if (!emailValue.every((item) => item.toLowerCase().includes(value.toLowerCase()))) {
				return false;
			}
		} else if (column == "mothername") {
			const motherNameValue = (
				await this.baseInstance.getTextFromAllElements(elements.childTableAllProcessMotherNameField)
			).slice(1);
			Base.logger.info("Data from mothername column: " + motherNameValue);
			if (!motherNameValue.every((item) => item.toLowerCase().includes(value.toLowerCase()))) {
				return false;
			}
		}
		return true;
	}

	async resetFilter(columnName: string) {
		const column = capitalizeFirstChar(columnName);
		await this.clickFieldFilterButton(column);
		await this.baseInstance.clickOnlyVisibleElement(elements.childWorkflowTableFilterResetButton, "search icon");
	}

	async searchInColumn(ColumnName: string, param: string) {
		const column = capitalizeFirstChar(ColumnName);
		await this.clickFieldFilterButton(column);
		let xpath = "";
		if (column == "Email") {
			xpath = elements.childWorkflowTableSearchInputField.replace("arg", "Search Email");
			await this.baseInstance.enterText(xpath, param, "Search for " + column + " : " + param);
		} else if (column == "Mothername") {
			xpath = elements.childWorkflowTableSearchInputField.replace("arg", "Search Mothername");
			await this.baseInstance.enterText(xpath, param, "Search for " + column + " : " + param);
		}
		await this.baseInstance.clickOnlyVisibleElement(elements.childWorkflowTableFilterSearchButton, "search icon");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}
}
