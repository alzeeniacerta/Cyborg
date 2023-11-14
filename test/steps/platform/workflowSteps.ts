import { When, Then, DataTable } from "@cucumber/cucumber";
import WorkflowPage from "../../pages/platform/workflowPage";
import * as assert from "assert";
import { baseInstance } from "../../helpers/BaseClass";
import { getDate } from "../../helpers/util/basic";

const workflowPage: WorkflowPage = new WorkflowPage(baseInstance);

Then("Verify user is redirected to {string} workflow", async function (workflowType: string) {
	assert((await workflowPage.workflowIsOpened(workflowType)) == true, "Recent workflows is not displayed");
	await workflowPage.getworkflowID(workflowType);
});

Then("User mentions {string} on {string} comment", async function (user: string, commentType: string) {
	await workflowPage.commentOnWorkflow(user, commentType);
});

When("User assigns step to {string}", async function (user: string) {
	await workflowPage.assignStepToUser(user);
});

Then("Verify step is assigned to {string}", async function (user: string) {
	assert((await workflowPage.getStepAssignedUsers()).includes(user), "Step is not assigned to " + user);
});

Then("Verify all workflow comments", async function () {
	assert((await workflowPage.getCommentCount()) == 2, "All workflow comments are not displayed");
	await workflowPage.closeSidePanel();
});

Then("User clicks in all comments button", async function () {
	await workflowPage.clickAllCommentsButton();
});

When("User clicks on {string} option from workflow options", async function (option: string) {
	await workflowPage.clickOptionFromWorkflowOptions(option);
});

When("User clicks on {string} tab in activity log", async function (tab: string) {
	await workflowPage.clickTabInActivityLog(tab);
});

Then("Verify activity log is displayed", async function () {
	await workflowPage.clickAllCommentsButton();
});

Then("Verify logs are displayed", async function (dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	for (const data of table) {
		assert((await workflowPage.verifyLog(data[0], data[1], data[2], data[3])) == true, "Log is not displayed");
	}
	await baseInstance.takeScreenshot();
	await workflowPage.closeSidePanel();
});

When("User enters {string} in {string} field", async function (data: string, field: string) {
	await workflowPage.enterDataInField(data, field);
});

When("User submits workflow step", async function () {
	await workflowPage.submitWorkflowStep();
});

When("User submits child workflow step", async function () {
	await workflowPage.submitChildWorkflowStep();
});

When("User clicks {string} step on workflow page", async function (stepName: string) {
	await workflowPage.clickonStep(stepName);
});

When("User clicks edit step on workflow page", async function () {
	await workflowPage.editWorkflowStep();
});

Then("Verify workflow complete message is displayed", async function () {
	assert((await workflowPage.verifyWorkflowCompleteMessage()) == true, "Workflow complete message is not displayed");
});

Then("Verify workflow status is {string}", async function (WorkflowStatus: string) {
	assert((await workflowPage.workflowIsCompleted()) == WorkflowStatus, "Workflow status does not match");
});

Then("verify Workflow has some status", async function () {
	assert((await workflowPage.verifyWorkflowHasStatus()) == true, "Workflow status does not match");
});

When("User downloads logs", async function () {
	await workflowPage.downloadLogs();
});

When("Verify downloaded logs", async function (dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	const fileName = "activity_log_" + getDate() + ".xlsx";
	await workflowPage.verifyDownloadedLogs(baseInstance.downloadPath + fileName, table);
});

Then("user checks for {string} table", async function (tablename: string) {
	assert((await workflowPage.verifyChildTable(tablename)) == true, "child table is not visible");
});

Then("user checks for {string} button in child workflow", async function (addButtonName: string) {
	assert((await workflowPage.verifyAddButtomCount(addButtonName)) == 2, "add button is not visible");
});

Then("user checks for {string} text on page should {string} visible", async function (text: string, visible: string) {
	if (visible == "not") {
		assert((await workflowPage.checkTextOnPage(text)) == false, text + " is displayed");
	} else {
		assert((await workflowPage.checkTextOnPage(text)) == true, text + " is not displayed");
	}
});

Then("user clicks on {string} button in child table", async function (addButtonName: string) {
	await workflowPage.clickAddButton(addButtonName);
});

Then("user checks for {string} table", async function (tablename: string) {
	assert((await workflowPage.verifyChildTable(tablename)) == true, "child table is not visible");
});

Then("user checks for {string} button in child workflow", async function (addButtonName: string) {
	assert((await workflowPage.verifyAddButtomCount(addButtonName)) == 2, "add button is not visible");
});

Then("user checks for {string} text on page should {string} visible", async function (text: string, visible: string) {
	if (visible == "not") {
		assert((await workflowPage.checkTextOnPage(text)) == false, text + " is displayed");
	} else {
		assert((await workflowPage.checkTextOnPage(text)) == true, text + " is not displayed");
	}
});

Then("user clicks on {string} button in child table", async function (addButtonName: string) {
	await workflowPage.clickAddButton(addButtonName);
});

Then("user checks for child workflow header", async function () {
	assert((await workflowPage.verifyHeader()) == true, "Side Panel Header is not visible");
});

When("user clicks on close button", async function () {
	await workflowPage.clickCloseButton();
});

Then("user checks for discard dialogue box", async function () {
	assert((await workflowPage.verifyDiscardDialogueBoxVisibility()) == true, "Side Panel Header is not visible");
});

When("user click on {string} in dialogue box", async function (text: string) {
	await workflowPage.clickActionDialogBox(text);
});

When("user click on {string} in dialogue box", async function (text: string) {
	await workflowPage.clickActionDialogBox(text);
});

Then(
	"user verify {string} data for parent to child mapping in {string} field",
	async function (data: string, fieldLabel: string) {
		assert((await workflowPage.verifyParentToChildMapping(fieldLabel)) == data, "parent to child mapping is incorrect");
	},
);

Then(
	"user verify {string} data for child to parent mapping in {string} field",
	async function (data: string, fieldLabel: string) {
		assert((await workflowPage.verifyChildToParentMapping(fieldLabel)) == data, "child to parent mapping is incorrect");
	},
);

Then("user checks for table row count should be {string}", async function (count: string) {
	assert((await workflowPage.getChildtableRowCount()) == count, "table row count is incorrect");
});

When("user get the workflow data for workflow with name {string}", async function (workflowName: string) {
	await workflowPage.getWorkflowData(workflowName);
});

Then("user verify the newly added workflow {string}", async function (workflowName: string) {
	assert((await workflowPage.verifyWorkflowCreation(workflowName)) == true, "data is not matched correctly");
});

When("user get the workflow data from table with name {string}", async function (workflowName: string) {
	await workflowPage.getWorkflowDataFromTable(workflowName);
});

Then("user verify the the workflow data", async function () {
	assert((await workflowPage.verifyWorkflowData()) == true, "data is not matched correctly");
});

When("User sorts {string} column in child workflow table", async function (columnName: string) {
	await workflowPage.clickToSortChildTableField(columnName);
});

Then("Verify records in child workflow table sorted by {string} field", async function (columnName: string) {
	assert(
		(await workflowPage.verifyChildTableRecordsAreSorted(columnName)) == true,
		"Records are not sorted by " + columnName + " field",
	);
});

When("User enters filter in child workflow table and clicks search", async function (dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	for (const data of table) {
		await workflowPage.enterInFilterAndSearch(data[0], data[1]);
	}
});

Then("Verify applied filters are working in child workflow table", async function (dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	for (const data of table) {
		assert(
			(await workflowPage.verifyAppliedFilters(data[0], data[1])) === true,
			"Given filter: " + data[1] + " is not applied for field: " + data[0],
		);
	}
});

When("user reset the filter for {string} column", async function (columnName: string) {
	await workflowPage.resetFilter(columnName);
});

When("User search in child workflow table and clicks search", async function (dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	for (const data of table) {
		await workflowPage.searchInColumn(data[0], data[1]);
	}
});
