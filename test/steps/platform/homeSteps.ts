import { When, Then, DataTable } from "@cucumber/cucumber";
import HomePage from "../../pages/platform/homePage";
import * as assert from "assert";
import { baseInstance } from "../../helpers/BaseClass";
import { capitalizeFirstChar } from "../../helpers/util/basic";
import { getUserDetails } from "../../helpers/jsonHelper";

const homePage: HomePage = new HomePage(baseInstance);

When("User clicks on studio button", async function () {
	await homePage.clickStudioBtn();
});

Then("Verify create new is displayed", async function () {
	assert((await homePage.createNewMessageIsDisplayed()) == true, "Create new message is not displayed");
});

Then("Verify create new button is displayed", async function () {
	assert((await homePage.createNewButtonIsDisplayed()) == true, "Create new button is not displayed");
});

Then("Verify footer is displayed", async function () {
	assert((await homePage.footerIsDispayed()) == true, "Footer is not displayed");
});

Then("Verify hello user message is displayed", async function () {
	const fname = (await getUserDetails(baseInstance.user)).firstname;
	const expectedMessage: string = "Hello " + capitalizeFirstChar(fname);
	const actualMessage: string = await homePage.getHelloUserMessage();
	assert(actualMessage == expectedMessage, expectedMessage + " message is not correct: " + actualMessage);
});

Then("Verify welcome message is displayed", async function () {
	assert((await homePage.welcomeMessageIsDisplayed()) == true, "Welcome message is not displayed");
});

Then("Verify search field is displayed", async function () {
	assert((await homePage.searchFieldIsDisplayed()) == true, "Verifysearch field is not displayed");
});

When("User clicks on search field", async function () {
	await homePage.clickOnSearchField();
});

When("User clicks on Advanced Search", async function () {
	await homePage.clickOnAdvancedSearch();
});

Then("Verify advanced search is displayed", async function () {
	assert((await homePage.advancedSearchPageIsDisplayed()) == true, "Advanced search page is not displayed");
});

Then("Verify help button is displayed", async function () {
	assert((await homePage.helpButtonIsDisplayed()) == true, "Help Button is not displayed");
});

When("User clicks on help button", async function () {
	await homePage.clickHelpButton();
});

Then(
	"Verify user is redirected to {string} on when user clicks on {string} option",
	async function (url: string, option: string) {
		assert(
			(await homePage.getPopUpURLForNewPageOnOptionClick(option)).toLowerCase == url.toLowerCase,
			"User is not redirected to " + url + " on clicking " + option,
		);
	},
);

Then("Verify recent workflows is displayed", async function () {
	assert((await homePage.recentlyViewedIsDisplayed()) == true, "Recent workflows is not displayed");
});

When("User clicks on {string} workflow", async function (taskType: string) {
	if (taskType == "recent") {
		await homePage.clickOnRecentWorkflow();
	} else if (taskType == "starred") {
		await homePage.clickOnStarredWorkflow();
	} else if (taskType == "shortcut") {
		await homePage.clickOnShortcutWorkflow();
	} else if (taskType == "waiting on you") {
		await homePage.clickOnWOYWorkflow();
	} else if (taskType == "requested by you") {
		await homePage.clickOnRBYWorkflow();
	} else {
		throw "Please specify 'recent', 'starred', 'shortcut', 'waiting on you', 'requested by you' tasks";
	}
});

When("User clicks home button", async function () {
	await homePage.clickHomeButton();
});

When("User clicks tenant logo", async function () {
	await homePage.clickTenantLogo();
});

When("User clicks on {string} from user profile dropdown", async function (option: string) {
	await homePage.clickOptionFromUserProfileDropdown(option);
});

When("User clicks on waiting on you button", async function () {
	await homePage.clickOnWaitingOnYouButton();
});

Then("Verify process table headers", async function () {
	assert(
		(await homePage.verifyProcessTableIsPresent()) == true,
		"Process table and table headers are not displayed correctly",
	);
});

Then("Count the number of {string} tasks", async function (taskType: string) {
	if (taskType == "assigned") {
		homePage.numberOfAssignedtask = await homePage.countTasks();
	} else if (taskType == "requested") {
		homePage.numberOfRequestedTasks = await homePage.countTasks();
	} else {
		throw "Please specify 'assigned' or 'requested' tasks";
	}
});

Then("Verify task count is equal to tasks assigned", async function () {
	const tasksCountBadge: number = await homePage.getTasksCountBadge();
	assert(
		homePage.numberOfAssignedtask == tasksCountBadge,
		"Tasks red badge count is not equal to assigned tasks expected=" +
			homePage.numberOfAssignedtask +
			" actual=" +
			tasksCountBadge,
	);
	await homePage.countTasks();
});

Then("Verify pagination message for {string} tasks", async function (taskType: string) {
	let numberOfTasks: number = 0;
	let expectedMessage: string = "";

	if (taskType == "assigned") {
		numberOfTasks = homePage.numberOfAssignedtask;
	} else if (taskType == "requested") {
		numberOfTasks = homePage.numberOfRequestedTasks;
	} else {
		throw "Please specify 'assigned' or 'requested' tasks";
	}

	if (numberOfTasks <= 20) {
		expectedMessage = "SHOWING 1-" + numberOfTasks + " OUT OF " + numberOfTasks + " ITEMS";
	} else {
		expectedMessage = "SHOWING 1-20 OUT OF " + numberOfTasks + " ITEMS";
	}

	const actualMessage: string = await homePage.verifyPaginationMessage();
	assert(
		actualMessage == expectedMessage,
		"Pagination message is not displayed correctly expected=" + expectedMessage + " actual=" + actualMessage,
	);
});

When("User clicks on requested by you button", async function () {
	await homePage.clickOnRequestedByYouButton();
});

When("User sorts {string} field", async function (field: string) {
	await homePage.clickToSortTableField(field);
});

Then("Verify records are sorted by {string} field", async function (field: string) {
	assert((await homePage.verifyRecordsAreSorted(field)) == true, "Records are not sorted by " + field + " field");
});

When("User enters filter and clicks search", async function (dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	for (const data of table) {
		await homePage.enterInFilterAndSearch(data[0], data[1]);
	}
});

Then("Verify filters are applied", async function (dataTable: DataTable) {
	const table = dataTable.rows().slice(0);
	for (const data of table) {
		assert(
			(await homePage.verifyAppliedFilters(data[0], data[1], data[2], data[3])) === true,
			"Given filter: " + data[1] + " is not applied for field: " + data[0],
		);
	}
});

When("User clicks on clear filter button", async function () {
	await homePage.clickClearFiltersButton();
});

When("User clicks create new button", async function () {
	await homePage.clickCreateNewButton();
});

When("User searches {string} in create new search", async function (workflowName: string) {
	await homePage.enterTextInCreateNewSearch(workflowName);
});

When("User initiates a workflow for {string}", async function (workflowName: string) {
	await homePage.userClicksOnSearchresult(workflowName);
});

Then("Verify user avatar is displayed", async function () {
	const expectedText: string =
		(await getUserDetails(baseInstance.user)).firstname.charAt(0).toUpperCase() +
		(await getUserDetails(baseInstance.user)).lastname.charAt(0).toUpperCase();
	const actualText: string = await homePage.getTextFromUserAvatar();
	assert(
		actualText == expectedText,
		"User avatar text not displayed correctly. Expected: " + expectedText + " Actual: " + actualText,
	);
});

When("User impersonates {string} as {string}", async function (user: string, userType:string) {
	await homePage.clickOptionFromUserProfileDropdown("View As");
	await homePage.userImpersonates(user, userType);
});

Then("Verify user views as {string}", async function (user: string) {
	assert((await homePage.getViewingAsUser()) == user, "User is not impersonated correctly");
});

When("User clicks on user mentions icon", async function () {
	await homePage.clickOnUserMentionsIcon();
});

Then("Verify total number of mentions {string}", async function (beforeOrAfter: string) {
	const mentions = await homePage.getTotalMentions();
	switch (beforeOrAfter) {
		case "before commenting":
			homePage.totalMentionsBeforeComments = mentions;
			break;
		case "after commenting":
			assert(homePage.totalMentionsBeforeComments + 2 == mentions, "Total mentions badge count is not correct");
			break;
		default:
			throw "Please specify 'before commenting' or 'after commenting'";
	}
	await homePage.closeMyMentionsPanel();
});

Then("Verify home mentions badge", async function () {
	let count = "";
	if (homePage.totalMentionsBeforeComments > 9) {
		count = "9+";
	} else {
		count = homePage.totalMentionsBeforeComments.toString();
	}
	assert(
		count == (await homePage.getHomeMentionsBadgeCount()),
		"Home mentions badge count is not correct: expected-" +
			count +
			", actual-" +
			(await homePage.getHomeMentionsBadgeCount()),
	);
});

When("User switches back to the original user", async function () {
	await homePage.switchBackToOriginalUser();
});

Then("Verify user is redirected to comment section", async function () {
	await homePage.switchBackToOriginalUser();
});

When("User archives workflow", async function () {
	await homePage.archiveWorkflowFromProcessTable();
});

Then("Verify {string} workflow is archived", async function (taskType: string) {
	if (taskType == "assigned") {
		assert((await homePage.countTasks()) == homePage.numberOfAssignedtask - 1, "Assigned workflow is not archived");
	} else if (taskType == "requested") {
		assert((await homePage.countTasks()) == homePage.numberOfRequestedTasks - 1, "Requested workflow is not archived");
	} else {
		throw "Please specify 'assigned' or 'requested' tasks";
	}
});

When("User clicks on comments in process table", async function () {
	await homePage.clickOnCommentsInProcessTable();
});

When("User clicks on progress of workflow", async function () {
	await homePage.clickOnProgress();
});

Then("Verify progress modal is displayed", async function () {
	assert((await homePage.progressModalIsDisplayed()) == true, "Progress modal is not displayed");
});

When("User clicks on step inside progress modal", { timeout: 3000 }, async function () {
	await homePage.clickOnStepInsideProgressModal();
});

When("user clicks on profile icon dropdown", async function () {
	await homePage.clickProfileIcon();
});

Then("user checks for {string} Button should {string} visible", async function (ButtonText:string, visible:string) {
	if(visible=="not"){
		assert(await homePage.checkForButtonUnderProfileDropdown(ButtonText) == false, ButtonText+" is displayed");
	}else {
		assert(await homePage.checkForButtonUnderProfileDropdown(ButtonText) == true, ButtonText+" is not displayed");
	}
});