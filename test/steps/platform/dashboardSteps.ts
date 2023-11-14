import { When, Then, DataTable } from "@cucumber/cucumber";
import * as assert from "assert";
import { Base, baseInstance } from "../../helpers/BaseClass";
// import { capitalizeFirstChar } from "../helpers/util/basic";
import DashboardPage from "../../pages/platform/dashboardPage";
import { getFileNamesFromFolder } from "../../helpers/util/file";

const dashboardPage: DashboardPage = new DashboardPage(baseInstance);

When("User clicks on dashboard button", async function () {
	await dashboardPage.clickDashboardButton();
});

Then("Verify dashboard page is displayed", async function () {
	await dashboardPage.clickDashboardButton();
});

When("User selects {string} dashboard", async function (dashboardName: string) {
	await dashboardPage.selectDashboard(dashboardName);
	assert((await dashboardPage.getDashboardName()) == dashboardName, "Dashboard name is not correct");
	await dashboardPage.saveReportNames();
});

When("User clicks on dashboard options", async function () {
	await dashboardPage.clickDashboardOptionsButton();
});

When("User clicks {string} option", async function (option: string) {
	await dashboardPage.clickOption(option);
});

When("User drags report from position {int} to {int}", async function (oldPosition: number, newPosition: number) {
	await dashboardPage.dragReport(oldPosition, newPosition);
});

Then(
	"Verify report is dragged from position {int} to {int}",
	async function (oldPosition: number, newPosition: number) {
		assert(
			(await dashboardPage.verifyReportPosition(oldPosition, newPosition)) == true,
			"Report is not dragged to new position",
		);
		await baseInstance.takeScreenshot();
	},
);

When("User clicks done on dashboard page", async function () {
	await dashboardPage.clickDone();
	await baseInstance.waitForAppLoaderToDisappear();
});

When("User clicks menu options for report {int}", async function (reportIndex: number) {
	await dashboardPage.clickReportMenu(reportIndex);
});

Then("Save report data for report {int}", async function (reportIndex: number) {
	await dashboardPage.saveReportData(reportIndex);
});

When("User clicks {string} from report options", async function (option: string) {
	switch (option.toLowerCase()) {
		case "export to csv":
			await dashboardPage.exportReportToCSV();
			break;
		case "activity log":
			await dashboardPage.clickActivityLogs();
			break;
		default:
			await dashboardPage.clickOption(option);
	}
});

Then("Verify process name from exported file {string}", async function (fileName: string) {
	assert((await dashboardPage.verifyProcessNameInExportedCSV(fileName)) == true, "Report content is not correct");
});

When("User clicks {string} button for report {int}", async function (buttonName: string, reportIndex: number) {
	await dashboardPage.clickButtonForReport(buttonName, reportIndex);
});

Then("Verify expanded report is displayed", async function () {
	assert((await dashboardPage.getReportNames()).length == 1, "Report is not expanded");
	await baseInstance.takeScreenshot();
});

When("User clicks add report button", async function () {
	await dashboardPage.clickOnAddReport();
});

When("User names report as {string}", async function (reportName: string) {
	await dashboardPage.setReportName(reportName);
});

When("User sets report basic filters", async function (dataTable: DataTable) {
	const filterList = dataTable.rows().slice(0);
	for (const data in filterList) {
		await dashboardPage.setBasicFilter(filterList[data][0], filterList[data][1]);
	}
});

When("User clicks save report button", async function () {
	await dashboardPage.clickOnSaveReport();
});

Then("Verify report name is {string}", async function (reportName: string) {
	const actual = await dashboardPage.getReportNames();
	assert(actual.includes(reportName), "Report name is not correct. Expected: " + reportName + " Actual: " + actual);
});

Then("Verify report {string} is deleted", async function (reportName: string) {
	assert(await dashboardPage.verifyReportIsDeleted(reportName), "Report is not deleted");
});

Then("Verify logs are displayed for dashboard report", async function (dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	for (const data of table) {
		assert((await dashboardPage.verifyLog(data[0], data[1], data[2], data[3])) == true, "Log is not displayed");
	}
	await baseInstance.takeScreenshot();
	await dashboardPage.closeSidePanel();
});

Then("Verify {int} report are displayed on dashboard", async function (numberOfReports: number) {
	const actualNumberOfReports = (await dashboardPage.getReportNames()).length;
	assert(
		actualNumberOfReports == numberOfReports,
		"Correct number of reports are not displayed. Expected: " + numberOfReports + "; Actual: " + actualNumberOfReports,
	);
});

When("User {string} report {int} to wishlist", async function (operation: string, reportIndex: number) {
	await dashboardPage.clickOnWishlistButton(operation, reportIndex);
});

When("User clicks on create new dashboard button", async function () {
	await dashboardPage.creatNewDashboard();
});

When("User enters {string} in dashboard name field", async function (dashboardName: string) {
	await dashboardPage.enterDashboardName(dashboardName);
});

When("User clicks create dashboard button", async function () {
	await dashboardPage.clickOnCreateDashboard();
	await baseInstance.wait(1);
	await baseInstance.waitForAppLoaderToDisappear();
});

When("User clicks update dashboard button", async function () {
	await dashboardPage.clickOnUpdateDashboard();
	await baseInstance.wait(1);
});

Then("Verify dashboard name {string}", async function (dashboardName: string) {
	const actualDashboardName = await dashboardPage.getDashboardName();
	assert(
		actualDashboardName.toLowerCase() == dashboardName.toLowerCase(),
		"Dashboard name is not correct Expected: " + dashboardName + " Actual: " + actualDashboardName,
	);
});

Then("Verify {string} dashboard is deleted", async function (dashboardName: string) {
	const dashboards = await dashboardPage.getDashboardNames();
	dashboards.forEach((dashboard) => {
		assert(dashboard.toLowerCase() != dashboardName.toLowerCase(), "Dashboard is not deleted");
	});
});

When("User jumps to {string} dashboard", async function (dashboardName: string) {
	await dashboardPage.jumpToDashboard(dashboardName);
});

When("User jumps to {string} report", async function (reportName: string) {
	await dashboardPage.jumpToReport(reportName);
});

When("User downloads dashboard in {string} format", async function (exportType: string) {
	await dashboardPage.downloadDashboard(exportType);
});

Then("Verify contents of dashboard {string} file", async function (fileType: string, dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	const fileContent = await dashboardPage.getFileContent(fileType);
	Base.logger.info("File content: " + fileContent);
	for (const data of table) {
		assert(fileContent.includes(data[0]), "Dashboard content is not correct");
	}
});

When("User extracts dashboard file", async function () {
	await dashboardPage.extractDashboardFile();
});

Then("Verify files are extracted in downloads folder", async function (dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	const fileNames = getFileNamesFromFolder(baseInstance.downloadPath);
	for (const data of table) {
		assert(
			fileNames.some((fileName) => fileName.includes(data[0])),
			"File name is not present in downloads folder",
		);
	}
});

When("User clicks on create subscription button", async function () {
	await dashboardPage.clickOnCreateSubscription();
});

When("User selects {string} as subscription type", async function (subscriptionType: string) {
	await dashboardPage.clickOnSubscriptionType(subscriptionType);
});

When("User enters {string} in subscription name", async function (subscriptionName: string) {
	await dashboardPage.enterSubscriptionName(subscriptionName);
});

When("User enters time for subscription", async function () {
	await dashboardPage.enterTimeForSubscription();
});

When("User clicks subscribe button", async function () {
	await dashboardPage.clickOnSubscribeButton();
});

When("User enters email in select users field for subscription", async function () {
	await dashboardPage.enterEmailInSubscription();
});

When("User deletes subscription", async function () {
	await dashboardPage.deleteSubscription();
});

When("User clicks on ok button", async function () {
	await dashboardPage.clickOkButton();
});
