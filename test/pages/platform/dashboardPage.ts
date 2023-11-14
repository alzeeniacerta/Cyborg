import { Base, BaseClass } from "../../helpers/BaseClass";
import { verifyCSVFileContent } from "../../helpers/util/excel_csv";
import { XPathBuilder } from "../../helpers/util/xpathBuilder";
import { elements } from "../../xpath/platform/dashboardPageElements";
import { capitalizeFirstCharAllWords, getCurrentTimezone, getDateTimeWithAddedMinutes } from "../../helpers/util/basic";
import { extractTextFromPDF } from "../../helpers/util/pdf";
import { extractTextFromImage } from "../../helpers/util/png";
import { extractZip } from "../../helpers/util/file";
import { extractTextFromPPTX } from "../../helpers/util/ppt";
import { getUserDetails } from "../../helpers/jsonHelper";

export default class DashboardPage {
	baseInstance: BaseClass;
	reports = [];
	reportData = [];
	dashboardFileName = "";

	constructor(baseInstance: BaseClass) {
		this.baseInstance = baseInstance;
	}

	// async clickDashboardButton() {
	// 	await this.baseInstance.clickElement(elements.dashboardButton,"Dashboards button");
	// }

	async clickDashboardButton() {
		await this.baseInstance.clickElement(elements.dashboardButton, "Dashboards button");
	}

	async dashboardIsDisplayed() {
		return await this.baseInstance.isDisplayed(elements.dashboardList);
	}

	async selectDashboard(dashboardName: string) {
		const xpath = new XPathBuilder().button().withRole("tab").withText(dashboardName).build();
		await this.baseInstance.clickElement(xpath, dashboardName + " Dashboard");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async saveReportNames() {
		this.reports = await this.getReportNames();
	}

	async getDashboardName(): Promise<string> {
		return await this.baseInstance.getText(elements.dashboardName);
	}

	async clickDashboardOptionsButton() {
		const xpath = new XPathBuilder().button().withLabel("Dashboard Options").build();
		await this.baseInstance.clickElement(xpath, "Report options button");
	}

	async clickOption(option: string) {
		const xpath = new XPathBuilder().div().withRole("menuitem").withText(option).build();
		await this.baseInstance.clickElement(xpath, "Report option " + option);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickActivityLogs() {
		await this.clickOption("Activity Log");
		await this.clickTabInActivityLog("Views");
		await this.clickTabInActivityLog("Edits");
		await this.clickTabInActivityLog("Emails");
	}

	async clickTabInActivityLog(tab: string) {
		const tabDiv = new XPathBuilder().span().containsText(capitalizeFirstCharAllWords(tab)).atIndex(1).build();
		await this.baseInstance.clickElement(tabDiv, "Tab " + tab);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async dragReport(oldPosition: number, newPosition: number) {
		// there are 2 rearrange button for each report 1st is for position 1 and 2nd is for width
		const buttonIndex = (oldPosition - 1) * 2 + 1;
		await this.baseInstance.hoverOverElement(elements.rearrangeButton.replace("index", buttonIndex.toString()));
		const y = 175 + (newPosition - 1) * 125;
		await this.baseInstance.mouseDown();
		await this.baseInstance.mouseMove(0, y);
		await this.baseInstance.mouseUp();
	}

	async getReportNames() {
		return await this.baseInstance.getTextFromAllElements(elements.reportNames);
	}

	async verifyReportPosition(oldPosition: number, newPosition: number): Promise<boolean> {
		const newReports = await this.getReportNames();
		if (newReports[newPosition - 1] == this.reports[oldPosition - 1]) {
			return true;
		}
	}

	async clickDone() {
		const xpath = new XPathBuilder().button().withLabel("Done").build();
		await this.baseInstance.clickElement(xpath, "Done button");
	}

	async clickReportMenu(reportIndex: number) {
		const xpath = new XPathBuilder().button().withLabel("Report menu").atIndex(reportIndex).build();
		await this.baseInstance.clickElement(xpath, "Report menu button");
	}

	async exportReportToCSV() {
		const xpath = new XPathBuilder().div().withRole("menuitem").child().div().containsText("Export to CSV").build();
		await this.baseInstance.clickElement(xpath, "Export to CSV button");
		await this.baseInstance.keyboardPress("ArrowRight");
		await this.baseInstance.keyboardPress("ArrowDown");
		await this.baseInstance.keyboardPress("Enter");
	}

	async saveReportData(reportIndex: number) {
		this.reportData = await this.baseInstance.getTextFromAllElements(
			elements.reportData.replace("index", reportIndex.toString()),
		);
	}

	async verifyProcessNameInExportedCSV(fileName: string): Promise<boolean> {
		this.reportData[0] = this.reportData[0].split("/")[0];
		if (!(await verifyCSVFileContent(fileName, this.reportData[0]))) {
			return false;
		}
		return true;
	}

	async clickButtonForReport(buttonName: string, reportIndex: number) {
		let xpath: string = "";
		switch (buttonName.toLowerCase()) {
			case "expand":
				xpath = new XPathBuilder().button().withLabel("Full screen report").atIndex(reportIndex).build();
				break;
			case "comment":
				xpath = new XPathBuilder().button().withLabel("Comments report").atIndex(reportIndex).build();
				break;
			default:
				throw new Error("Invalid button name");
		}
		await this.baseInstance.clickElement(xpath, buttonName + "button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickOnAddReport() {
		const xpath = new XPathBuilder().button().withLabel("Add Report").build();
		await this.baseInstance.clickElement(xpath, "Add report button");
	}

	async setReportName(reportName: string) {
		const editReportNameButton = new XPathBuilder().button().withLabel("Edit Report name").build();
		await this.baseInstance.clickElement(editReportNameButton, "Edit report name button");
		const reportNameInput = new XPathBuilder().textarea().withLabel("Report name").build();
		await this.baseInstance.enterText(reportNameInput, reportName, "Report name input");
	}

	async setReportDescription(reportName: string) {
		const editReportNameButton = new XPathBuilder().button().withLabel("Edit Report description").build();
		await this.baseInstance.clickElement(editReportNameButton, "Edit report description button");
		const reportNameInput = new XPathBuilder().textarea().withLabel("Report description").build();
		await this.baseInstance.enterText(reportNameInput, reportName, "Report description input");
	}

	/**
	 * Used for applying filters while creating new report
	 * @param field can be process type, status or contains
	 * @param filterValue
	 */
	async setBasicFilter(field: string, filterValue: string) {
		switch (field.toLowerCase()) {
			case "process type":
				await this.baseInstance.clickElement(elements.processTypeFilter, "Process type filter");
				await this.baseInstance.keyboardType(filterValue);
				await this.baseInstance.keyboardPress("Enter");
				break;
			case "contains":
				await this.baseInstance.enterText(elements.containsFilter, filterValue, "Contains filter");
				break;
			case "status":
				await this.baseInstance.clickElement(elements.statusFilter, "Status filter");
				await this.baseInstance.keyboardType(filterValue);
				await this.baseInstance.keyboardPress("Enter");
				break;
			default:
				throw new Error("Invalid filter field");
		}
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickOnSaveReport() {
		const xpath = new XPathBuilder().button().withLabel("Save Report").build();
		await this.baseInstance.clickElement(xpath, "Save report button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async verifyReportIsDeleted(reportName: string): Promise<boolean> {
		const updatedReports = await this.getReportNames();
		if (updatedReports.includes(reportName)) {
			return false;
		} else {
			return true;
		}
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

	async waitForLogToAppear(logType: string) {
		Base.logger.info("Waiting for log to appear");
		// await this.baseInstance.wait(5);
		await this.baseInstance.reloadPage();
		await this.baseInstance.waitForAppLoaderToDisappear();
		await this.clickReportMenu(1);
		await this.clickActivityLogs();
		await this.clickTabInActivityLog(logType);
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

	async closeSidePanel() {
		const closeButton = new XPathBuilder().span().withLabel("Close").atIndex(1).build();
		await this.baseInstance.clickElement(closeButton, "Close side section");
	}

	async clickOnWishlistButton(operation: string, reportIndex: number) {
		let xpath = "";
		switch (operation.toLowerCase()) {
			case "add":
				xpath = elements.addToWishlistButton.replace("index", reportIndex.toString());
				break;
			case "remove":
				xpath = elements.removeFromWishlistButton.replace("index", reportIndex.toString());
				break;
			default:
				throw new Error("Invalid operation");
		}
		await this.baseInstance.clickElement(xpath, operation + " wishlist button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async creatNewDashboard() {
		const xpath = new XPathBuilder().button().withLabel("Create new dashboard").build();
		await this.baseInstance.clickElement(xpath, "Create new dashboard button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async enterDashboardName(dashboardName: string) {
		const xpath = new XPathBuilder().input().withName("name").build();
		await this.baseInstance.enterText(xpath, dashboardName, "Dashboard name input");
	}

	async clickOnCreateDashboard() {
		const xpath = new XPathBuilder().button().withLabel("Create").build();
		await this.baseInstance.clickElement(xpath, "Create dashboard button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickOnUpdateDashboard() {
		const xpath = new XPathBuilder().button().withLabel("Update").build();
		await this.baseInstance.clickElement(xpath, "Update dashboard button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async getDashboardNames() {
		const xpath = new XPathBuilder().button().withRole("tab").build();
		return await this.baseInstance.getTextFromAllElements(xpath);
	}

	async jumpToDashboard(dashboardName: string) {
		const jumpToButtonDashboard = new XPathBuilder().span().withLabel("List").atIndex(1).build();
		await this.baseInstance.clickElement(jumpToButtonDashboard, "Jump to dashboard button");
		const option = new XPathBuilder().div().withRole("menuitemcheckbox").withText(dashboardName).build();
		await this.baseInstance.clickElement(option, "Dashboard option " + dashboardName);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async jumpToReport(reportName: string) {
		const jumpToButtonReport = new XPathBuilder().span().withLabel("List").atIndex(2).build();
		await this.baseInstance.clickElement(jumpToButtonReport, "Jump to report button");
		const option = new XPathBuilder().div().withRole("menuitemcheckbox").withText(reportName).build();
		await this.baseInstance.clickElement(option, "Report option " + reportName);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async downloadDashboard(exportType: string) {
		const exportAsButton = new XPathBuilder().div().withRole("menuitem").child().div().child().span().build();
		await this.baseInstance.hoverOverElement(exportAsButton);
		switch (exportType.toLowerCase()) {
			case "pdf":
				await this.baseInstance.keyboardPress("ArrowRight");
				break;
			case "png":
				await this.baseInstance.keyboardPress("ArrowRight");
				await this.baseInstance.wait(1);
				await this.baseInstance.keyboardPress("ArrowDown");
				await this.baseInstance.wait(1);
				break;
			case "ppt":
				await this.baseInstance.keyboardPress("ArrowRight");
				await this.baseInstance.wait(1);
				await this.baseInstance.keyboardPress("ArrowDown");
				await this.baseInstance.wait(1);
				await this.baseInstance.keyboardPress("ArrowDown");
				await this.baseInstance.wait(1);
				break;
			default:
				throw new Error("Invalid export type");
		}
		// Setup wait for event trigger
		const downloadLogsPromise = Base.page.waitForEvent("download");
		await this.baseInstance.keyboardPress("Enter");
		await this.baseInstance.waitForAppLoaderToDisappear();
		const downloadButton = new XPathBuilder().button().withLabel("Download").build();
		await this.baseInstance.clickElement(downloadButton, "Download button");
		const download = await downloadLogsPromise;
		this.dashboardFileName = download.suggestedFilename();
		Base.logger.info("Downloaded file type: " + exportType + "; file name: " + this.dashboardFileName);
		// Wait for the download process to complete and save the downloaded file somewhere.
		await download.saveAs(this.baseInstance.downloadPath + this.dashboardFileName);
	}

	async getFileContent(fileType: string) {
		switch (fileType.toLowerCase()) {
			case "pdf":
				return await extractTextFromPDF(this.baseInstance.downloadPath + this.dashboardFileName);
			case "png":
				return await extractTextFromImage(this.baseInstance.downloadPath + this.dashboardFileName);
			case "ppt":
				return await extractTextFromPPTX(this.baseInstance.downloadPath + this.dashboardFileName);
			default:
				throw new Error("Invalid file type");
		}
	}

	async extractDashboardFile() {
		await extractZip(this.baseInstance.downloadPath + this.dashboardFileName, this.baseInstance.downloadPath);
	}

	async clickOnCreateSubscription() {
		const xpath = new XPathBuilder().button().withLabel("Create subscription").build();
		await this.baseInstance.clickElement(xpath, "Create subscription button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickOnSubscriptionType(subscriptionType: string) {
		const xpath = new XPathBuilder().div().withRole("menuitem").containsText(subscriptionType).build();
		await this.baseInstance.clickElement(xpath, "Subscription type " + subscriptionType);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async enterSubscriptionName(subscriptionName: string) {
		const xpath = new XPathBuilder().input().withLabel("Subscription Name").build();
		await this.baseInstance.enterText(xpath, subscriptionName, "Subscription name input");
	}

	async enterTimeForSubscription() {
		const time = getDateTimeWithAddedMinutes(1).slice(11, 16);
		const xpath = new XPathBuilder().input().withLabel("Time picker").build();
		await this.baseInstance.enterText(xpath, time, "Time input");

		const timezone = getCurrentTimezone();
		let inputTimezone = "";
		if (timezone.toLowerCase().includes("asia")) {
			inputTimezone = "Asia/Kolkata";
		} else if (timezone.toLowerCase().includes("new york")) {
			inputTimezone = "America/New York";
		} else if (timezone.toLowerCase().includes("chicago")) {
			inputTimezone = "America/Chicago";
		} else if (timezone.toLowerCase().includes("los angeles")) {
			inputTimezone = "America/Los Angeles";
		} else if (timezone.toLowerCase().includes("utc")) {
			inputTimezone = "UTC";
		} else {
			throw new Error("Invalid timezone");
		}

		const timezoneInput = new XPathBuilder().input().withLabel("Select time zone").build();
		await this.baseInstance.enterText(timezoneInput, inputTimezone, "Timezone input");
		await this.baseInstance.keyboardPress("Enter");
	}

	async clickOnSubscribeButton() {
		const xpath = new XPathBuilder().button().withLabel("Subscribe").build();
		await this.baseInstance.clickElement(xpath, "Subscribe button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async enterEmailInSubscription() {
		const xpath = new XPathBuilder().input().withLabel("Select Users").build();
		await this.baseInstance.enterText(xpath, (await getUserDetails(this.baseInstance.user)).email, "Email input");
		await this.baseInstance.keyboardPress("Enter");
	}

	async deleteSubscription() {
		const xpath = new XPathBuilder().span().withLabel("Trashcan").atIndex(1).build();
		await this.baseInstance.clickElement(xpath, "Delete subscription button");
	}

	async clickOkButton() {
		const xpath = new XPathBuilder().button().withLabel("Ok").build();
		await this.baseInstance.clickElement(xpath, "OK button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}
}
