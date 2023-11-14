import { Given, When, Then } from "@cucumber/cucumber";
import LoginPage from "../../pages/platform/loginPage";
import { baseInstance } from "../../helpers/BaseClass";
import { getMFAOtp } from "../../helpers/util/authenticator";
import { assert } from "console";

const loginPage: LoginPage = new LoginPage(baseInstance);

Given("User navigates to application url", async function () {
	await loginPage.openApplicationUrl();
});

When("User clicks on certa associate", async function () {
	await loginPage.clickCertaAssociateButton();
});

When("User clicks on login using email and password", async function () {
	await loginPage.clickLoginUsingEmailAndPasswordButton();
});

When("User enters username in username field", async function () {
	await loginPage.enterUsername();
});

When("User enters password in password field", async function () {
	await loginPage.enterPassword();
});

When("User clicks on login button", async function () {
	await loginPage.clickLoginButton();
});

When("User enters correct MFA code", async function () {
	const code = await getMFAOtp();
	await loginPage.enterMFACode(code);
});

When("User enters incorrect MFA code", async function () {
	await loginPage.enterMFACode("999999");
});

Then("Validate error {string}", async function (error: string) {
	const actualError = (await loginPage.getDisplayedError()).toLowerCase();
	assert(actualError == error.toLowerCase(), "Error is not displayed");
	await baseInstance.takeScreenshot();
});

Then("Fail", async function () {
	throw new Error("This step intentionally fails");
});

Then("User checks for {string} text on login page should {string} visible", async function (text:string, visible:string) {
	if(visible=="not"){
		assert(await loginPage.checkMaintananceModeMessage(text) == false, text+" is displayed");
	}else {
		assert(await loginPage.checkMaintananceModeMessage(text) == true, text+" is not displayed");
	}
});

When("user checks for Oops page", async function () {
	assert(await loginPage.checkOopsPage() == true, "Maintanance mode is not enabled");
});

Then("check user gets logged out", async function () {
	assert(await loginPage.checkLogout() == true, "Maintanance mode is not enabled");
});