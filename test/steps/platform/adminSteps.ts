import { When, Then } from "@cucumber/cucumber";
import * as assert from "assert";
import { baseInstance } from "../../helpers/BaseClass";
import AdminPage from "../../pages/platform/adminPage";

const adminPage: AdminPage = new AdminPage(baseInstance);

Then("Verify admin message is displayed", async function () {
	assert((await adminPage.adminMessageIsDisplayed()) == true, "Admin message is not displayed");
});

When("User clicks on {string} from admin menu", async function (option: string) {
	await adminPage.clickOptionFromAdminMenu(option);
});

When("User select {string} configuration from list", async function (option: string) {
	await adminPage.selectConfiguration(option);
});

When("User clicks on config from admin menu", async function () {
	await adminPage.clickOnConfigFromAdminMenu();
});

When("User {string} MFA checkbox", async function (action: string) {
	switch (action) {
		case "checks":
			await adminPage.turnOnMFA();
			break;
		case "unchecks":
			await adminPage.turnOffMFA();
			break;
		default:
			throw new Error("Please provide 'checks' or 'unchecks'. Invalid action: " + action);
	}
});

When("User clicks on save button", async function () {
	await adminPage.clickSaveButton();
});

When("User enters username on admin page", async function () {
	await adminPage.enterUsername();
});

When("User enters password on admin page", async function () {
	await adminPage.enterPassword();
});

When("User clicks on login button on admin page", async function () {
	await adminPage.clickLoginButton();
});

When("User clicks on logout button on admin page", async function () {
	await adminPage.clickLogoutButton();
});

When("user find the {string} on admin page", async function (user: string) {
	await adminPage.findUser(user);
});

When("user clicks on search button on admin page", async function () {
	await adminPage.clickSearchButton();
});

When("user open the user data on admin page", async function () {
	await adminPage.openUserData();
});

When("user remove assigned user groups on admin page", async function () {
	await adminPage.removeUserGroups();
});

When("user remove the assigned permission from user on admin page", async function () {
	await adminPage.removeAssignedPermission();
});

When("user search for {string} permission on admin page", async function (permission: string) {
	await adminPage.searchPermission(permission);
});

When("user click on chooseall permission button on admin page", async function () {
	await adminPage.clickChooseAllButton();
});

When("user assign the user group {string} on admin page", async function (group: string) {
	await adminPage.assignUserGroup(group);
});

When("User add {string} as blacklisted from admin page", async function (user: string) {
	await adminPage.blackListUser(user);
});

Then("check for {string} in viewAs dropdown should {string} visible", async function (user: string, visible: string) {
	if (visible == "not") {
		assert((await adminPage.checkUserInViewAsUserList(user)) == false, "User is not blacklisted properly");
	} else {
		assert((await adminPage.checkUserInViewAsUserList(user)) == true, "User is blacklisted");
	}
});

When("User clicks {string} from {string} on admin page", async function (option: string, parent: string) {
	await adminPage.ChooseOptionFromAdminMenu(option, parent);
});

When("User remove the blacklisted user", async function () {
	await adminPage.removeBlacklistedUser();
});

When("User {string} maintanance mode", async function (action: string) {
	switch (action) {
		case "enable":
			await adminPage.turnOnMaintananceMode();
			break;
		case "disable":
			await adminPage.turnOffMaintananceMode();
			break;
		default:
			throw new Error("Please provide 'checks' or 'unchecks'. Invalid action: " + action);
	}
});

When("User add {string} in whitelisted user", async function (user: string) {
	await adminPage.addWhiteListUser(user);
});

Then("user verify success messgae", async function () {
	assert((await adminPage.successMessageIsDisplayed()) == true, "Admin message is not displayed");
});
