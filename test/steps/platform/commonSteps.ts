import { When, Then, DataTable, Given } from "@cucumber/cucumber";
import { Base, baseInstance } from "../../helpers/BaseClass";
import { getUserDetails } from "../../helpers/jsonHelper";
import { getLinkFromEmail, verifyEmailContent } from "../../helpers/util/email";
import * as assert from "assert";
import { downloadFileUsingURL } from "../../helpers/util/downloader";
import { verifyCSVFileContent } from "../../helpers/util/excel_csv";

let emailLink = "";

When("Take screenshot", async function () {
	await baseInstance.takeScreenshot();
});

When("Wait for {int} seconds", async function (seconds: number) {
	await baseInstance.wait(seconds);
});

Given("Set user as {string}", async function (user: string) {
	baseInstance.user = user;
});

When("Wait for page to load", async function () {
	// await baseInstance.waitForPageToLoad();
	// await baseInstance.waitForAppLoaderToDisappear();
});

When("Wait for app loader to dissapear", async function () {
	await baseInstance.waitForAppLoaderToDisappear();
});

When("User redirects {string} url", async function (page: string) {
	switch (page) {
		case "admin":
			await baseInstance.openURL(process.env.ADMIN);
			break;
		case "platform":
			await baseInstance.openURL(process.env.BASEURL);
			break;
		default:
			throw "Please specify 'admin' or 'platform' url";
	}
});

Then(
	"Verify content in email sent to {string} with subject {string}",
	async function (receiver: string, subject: string, dataTable: DataTable) {
		const contentList = dataTable.rows().slice(0);
		await baseInstance.wait(5);
		baseInstance.customLog("Checking mail from start time " + Base.worldInstance.startTime);
		if (receiver == "user") {
			receiver = (await getUserDetails(baseInstance.user)).email;
		}
		assert(await verifyEmailContent(receiver, subject, contentList), "Log is not displayed");
	},
);

Then("Get link from email with subject {string}", async function (subject: string) {
	await baseInstance.wait(5);
	baseInstance.customLog("Checking mail from start time " + Base.worldInstance.startTime);
	emailLink = await getLinkFromEmail((await getUserDetails(baseInstance.user)).email, subject);
});

When("User downloads {string} file from link", async function (flieName: string) {
	await downloadFileUsingURL(emailLink, flieName);
});

When("Verify contents of {string} file", async function (flieName: string, dataTable: DataTable) {
	const contentList = dataTable.rows().slice(0);
	const fileType = flieName.split(".")[1];
	switch (fileType) {
		case "csv":
			for (const data of contentList) {
				await verifyCSVFileContent(flieName, data[0]);
			}
			break;
		case "xlsx":
			// assert(await baseInstance.verifyExcelFileContent(flieName, contentList), "File content is not correct");
			break;
		case "pdf":
			// assert(await baseInstance.verifyExcelFileContent(flieName, contentList), "File content is not correct");
			break;
		default:
			throw "Please specify 'csv' or 'xlsx' file";
	}
});

When("User clicks back button", async function () {
	await baseInstance.goBackButton();
});
