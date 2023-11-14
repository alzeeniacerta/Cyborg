import { Then } from "@cucumber/cucumber";
import ProfilePage from "../../pages/platform/profilePage";
import { baseInstance } from "../../helpers/BaseClass";
import { getUserDetails } from "../../helpers/jsonHelper";
import * as assert from "assert";

const profilePage: ProfilePage = new ProfilePage(baseInstance);

Then("Verify user first name is displayed", async function () {
	const actualText: string = await profilePage.getUserFirstName();
	const expectedText: string = (await getUserDetails(baseInstance.user)).firstname;
	assert(actualText == expectedText, "User first name " + expectedText + " is not displayed correctly: " + actualText);
});

Then("Verify user last name is displayed", async function () {
	const actualText: string = await profilePage.getUserLastName();
	const expectedText: string = (await getUserDetails(baseInstance.user)).lastname;
	assert(actualText == expectedText, "User last name " + expectedText + " is not displayed correctly" + actualText);
});

Then("Verify user email is displayed", async function () {
	const actualText: string = await profilePage.getUserEmail();
	const expectedText: string = (await getUserDetails(baseInstance.user)).email;
	assert(actualText == expectedText, "User email " + expectedText + " is not displayed correctly" + actualText);
});
