import { Base, BaseClass } from "../../helpers/BaseClass";
import { capitalizeFirstChar } from "../../helpers/util/basic";
import { XPathBuilder } from "../../helpers/util/xpathBuilder";
import { elements } from "../../xpath/platform/homePageElements";

export default class LoginPage {
	baseInstance: BaseClass;

	constructor(baseInstance: BaseClass) {
		this.baseInstance = baseInstance;
	}

	public numberOfAssignedtask: number;
	public numberOfRequestedTasks: number;
	public totalMentionsBeforeComments: number;

	async clickStudioBtn() {
		await this.baseInstance.clickElement(elements.studioBtn, "Studio button");
	}

	async createNewMessageIsDisplayed(): Promise<boolean> {
		return await this.baseInstance.isDisplayed(elements.createNewMessage);
	}

	async createNewButtonIsDisplayed(): Promise<boolean> {
		return await this.baseInstance.isDisplayed(elements.createNewButton);
	}

	async footerIsDispayed(): Promise<boolean> {
		return (
			(await this.baseInstance.isDisplayed(new XPathBuilder().anyElement().containsText("POWERED BY").build())) &&
			(await this.baseInstance.isDisplayed(new XPathBuilder().anyElement().withLabel("NewLogo").build()))
		);
	}

	async getHelloUserMessage(): Promise<string> {
		return await this.baseInstance.getText(elements.helloUserMessage);
	}

	async welcomeMessageIsDisplayed(): Promise<boolean> {
		return await this.baseInstance.isDisplayed(elements.welcomeMessage.replace("arg", process.env.npm_config_ENV));
	}

	async clickOnSearchField() {
		await this.baseInstance.clickElement(elements.searchField, "Search field");
	}

	async searchFieldIsDisplayed(): Promise<boolean> {
		return await this.baseInstance.isDisplayed(elements.searchField);
	}

	async clickOnAdvancedSearch() {
		const xpath = new XPathBuilder().anyElement().containsText("Go to Advanced Search").atIndex(2).build();
		return await this.baseInstance.clickElement(xpath, "Advanced Search");
	}

	async advancedSearchPageIsDisplayed(): Promise<boolean> {
		const xpath = new XPathBuilder().div().containsText("Advanced Search").build();
		return await this.baseInstance.isDisplayed(xpath);
	}

	async helpButtonIsDisplayed(): Promise<boolean> {
		return await this.baseInstance.isDisplayed(elements.helpButton);
	}

	async clickHelpButton() {
		await this.baseInstance.clickElement(elements.helpButton, "Help button");
	}

	async getPopUpURLForNewPageOnOptionClick(option: string) {
		const xpath = new XPathBuilder().div().withRole("menuitem").containsText(option).build();
		const popupPromise = Base.page.waitForEvent("popup");
		await this.baseInstance.clickElement(xpath, "Help Option : " + option);
		const popup = await popupPromise;
		await popup.waitForLoadState();
		await this.baseInstance.takeScreenshotOfPage(popup);
		const url = popup.url();
		await popup.close();
		return url;
	}

	async recentlyViewedIsDisplayed(): Promise<boolean> {
		return (
			(await this.baseInstance.isDisplayed(elements.recentlyViewed)) &&
			this.baseInstance.isDisplayed(elements.recentlyViewedWorkflow)
		);
	}

	async clickOnRecentWorkflow() {
		this.baseInstance.recentWorkflowName = await this.baseInstance.getText(elements.recentlyViewedWorkflow);
		await this.baseInstance.clickElement(elements.recentlyViewedWorkflow, "Recently Viewed Workflow");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickTenantLogo() {
		await this.baseInstance.clickElement(elements.tenantLogo, "tenant logo");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickHomeButton() {
		await this.baseInstance.clickElement(elements.homeButton, "Home button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickOnStarredWorkflow() {
		this.baseInstance.starredWorkflowName = await this.baseInstance.getText(elements.starredWorkflow);
		await this.baseInstance.clickElement(elements.starredWorkflow, "Starred workflow");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickOptionFromUserProfileDropdown(option: string) {
		await this.baseInstance.clickElement(elements.userProfileDropdown, "User profile dropdown");
		await this.baseInstance.clickElement(
			elements.userProfileDropdownOption.replace("arg", capitalizeFirstChar(option)),
			"User profile dropdown option: " + option,
		);
		await this.baseInstance.waitForPageToLoad();
	}

	async clickOnWaitingOnYouButton() {
		await this.baseInstance.clickElement(elements.waitingOnYouButton, "Waiting on you button");
	}

	async verifyProcessTableIsPresent(): Promise<boolean> {
		const tableHeaders: string[] = ["Name", "Status", "Cycle time", "Progress", "My Tasks"];
		for (const header of tableHeaders) {
			const visibility: boolean = await this.baseInstance.isDisplayed(
				elements.processTableHeaders.replace("arg", header),
			);
			if (!visibility) {
				return false;
			}
		}
		return true;
	}

	async countTasks(): Promise<number> {
		let tasks: number = 0;
		let hasNextPage = true;
		while (hasNextPage) {
			tasks += (await this.baseInstance.getElementCount(elements.processTableAllRows)) - 1;
			hasNextPage = await this.baseInstance.isEnabled(elements.paginationNextButton);
			if (hasNextPage) {
				await this.baseInstance.clickElement(elements.paginationNextButton, "Pagination next button");
				await this.baseInstance.waitForAppLoaderToDisappear();
			}
		}
		await this.baseInstance.clickElement(elements.paginationPage1, "Pagination page 1");
		this.baseInstance.customLog("Total tasks: " + tasks);
		return tasks;
	}

	async getTasksCountBadge(): Promise<number> {
		return parseInt(await this.baseInstance.getText(elements.tasksCountBandge));
	}

	async verifyPaginationMessage() {
		return await this.baseInstance.getText(elements.paginationMessage);
	}

	async clickOnRequestedByYouButton() {
		await this.baseInstance.clickElement(elements.requestedByYouButton, "Requested by you button");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickToSortTableField(field: string) {
		await this.baseInstance.clickElement(
			elements.processTableHeadersSortButton.replace("arg", capitalizeFirstChar(field)),
			capitalizeFirstChar(field) + " sort",
		);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async verifyRecordsAreSorted(field: string): Promise<boolean> {
		const column = capitalizeFirstChar(field);
		let xpath = "";
		if (column == "Name") {
			xpath = elements.processTableAllProcessName;
		} else if (column == "Status") {
			xpath = elements.processTableAllStatus;
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
			elements.processTabelHeaderFilterButton.replace("arg", field),
			"Filter button for " + field,
		);
	}

	async enterInFilterAndSearch(field: string, param: string) {
		const column = capitalizeFirstChar(field);
		await this.clickFieldFilterButton(column);

		let xpath = "";
		let optionXpath = "";
		if (column == "Name") {
			xpath = elements.filterSearchInputField.replace("arg", "Search Name");
			await this.baseInstance.enterText(xpath, param, "Filter for " + column + " : " + param);
		} else if (column == "Status") {
			xpath = elements.filterSearchInputField.replace("arg", "Search");
			optionXpath = xpath + "/parent::div/following-sibling::div[2]/div/label/input[@aria-label='" + param + "']";
			await this.baseInstance.enterText(xpath, param, "Filter for " + column + " : " + param);
			await this.baseInstance.clickElement(optionXpath, "Checkbox for Status filter : " + param);
		}

		await this.baseInstance.clickElement(elements.filtersearchButton, "Search filter button for " + column);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async verifyAppliedFilters(
		field: string,
		value: string,
		resultExpected: string,
		verifyFilterTag: string,
	): Promise<boolean> {
		const column = field.toLowerCase();
		if (verifyFilterTag.toLowerCase() == "true") {
			let filterText = await this.baseInstance.getTextFromAllElements(elements.appliedFilters);
			filterText = filterText.map((text) => text.toLowerCase());
			Base.logger.info("Filters : " + filterText);

			// Filter tags verification
			const filter = field.toLowerCase() + ":" + value.toLowerCase();
			if (!filterText.includes(filter)) {
				return false;
			}
		}

		// Result verification
		if (column == "name" && resultExpected.toLowerCase() == "true") {
			const names = await this.baseInstance.getTextFromAllElements(elements.processTableAllProcessName);
			if (!names.every((item) => item.toLowerCase().includes(value.toLowerCase()))) {
				return false;
			}
		} else if (column == "status" && resultExpected.toLowerCase() == "true") {
			const statuses = await this.baseInstance.getTextFromAllElements(elements.processTableAllStatus);
			if (!statuses.every((item) => item == value)) {
				return false;
			}
		} else if (resultExpected.toLowerCase() == "false") {
			return await this.baseInstance.isDisplayed(elements.noResult);
		}
		return true;
	}

	async clickClearFiltersButton() {
		await this.baseInstance.clickElement(elements.clearFilterButton, "Clear filters button");
	}

	async clickCreateNewButton() {
		await this.baseInstance.clickElement(elements.createNewButton, "Create new button");
	}

	async enterTextInCreateNewSearch(workflowName: string) {
		await this.baseInstance.enterText(elements.createNewSearch, workflowName, "Create new search input field");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async userClicksOnSearchresult(workflowName: string) {
		await this.baseInstance.wait(1);
		await this.baseInstance.clickElement(elements.createNewSearchResult.replace("?", workflowName), "Create new search result");
	}

	async getTextFromUserAvatar() {
		return await this.baseInstance.getText(elements.userProfileDropdown);
	}

	async userImpersonates(user: string, userType: string) {
		// await this.baseInstance.mouseDown(elements.userProfileDropdownOption.replace("arg","View As"));
		await this.baseInstance.keyboardPress("ArrowRight");
		if (userType == "External User") {
			await this.baseInstance.keyboardPress("ArrowDown");
		}
		await this.baseInstance.keyboardPress("ArrowRight");
		await this.baseInstance.enterText(elements.searchViewAsUserInput, user, "Search view as user input field");
		await this.baseInstance.waitForAppLoaderToDisappear();
		await this.baseInstance.keyboardPress("ArrowDown");
		await this.baseInstance.keyboardPress("Enter");
		await this.baseInstance.wait(2);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async getViewingAsUser(): Promise<string> {
		const xpath = new XPathBuilder()
			.anyElement()
			.containsText("Viewing as")
			.followingSibling()
			.div()
			.atIndex(1)
			.build();
		return await this.baseInstance.getText(xpath);
	}

	async clickOnUserMentionsIcon() {
		const xpath = new XPathBuilder().anyElement().withLabel("Mentions").build();
		await this.baseInstance.clickElement(xpath, "User mentions icon");
	}

	async getTotalMentions(): Promise<number> {
		const totalMentions = new XPathBuilder().anyElement().containsText("My mentions").child().div().build();
		return parseInt(await this.baseInstance.getText(totalMentions));
	}

	async getHomeMentionsBadgeCount(): Promise<string> {
		const totalMentions = new XPathBuilder()
			.span()
			.withLabel((this.totalMentionsBeforeComments + 2).toString() + " mentions")
			.build();
		return await this.baseInstance.getText(totalMentions);
	}

	async closeMyMentionsPanel() {
		const closeButton = new XPathBuilder().button().withLabel("Close").build();
		await this.baseInstance.clickElement(closeButton, "Close my mentions panel");
	}

	async switchBackToOriginalUser() {
		const xpath = new XPathBuilder().anyElement().containsText("Switch back to your user").build();
		await this.baseInstance.clickElement(xpath, "Switch back to original user");
		await this.baseInstance.wait(3);
		await this.baseInstance.waitForAppLoaderToDisappear();
		await this.baseInstance.waitForPageToLoad();
	}

	async archiveWorkflowFromProcessTable() {
		const metaActionsButton = new XPathBuilder().button().withLabel("Meta actions").atIndex(1).build();
		await this.baseInstance.clickElement(metaActionsButton, "Meta actions button");
		const archive = new XPathBuilder().anyElement().withLabel("Archive").build();
		await this.baseInstance.clickElement(archive, "Archive button");
		const yesButton = new XPathBuilder().anyElement().containsText("Yes").build();
		await this.baseInstance.clickElement(yesButton, "Yes button");
		await this.baseInstance.wait(2);
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickOnShortcutWorkflow() {
		const shortcutIcon = new XPathBuilder().anyElement().withLabel("Create New...").child().button().atIndex(1).build();
		await this.baseInstance.clickElement(shortcutIcon, "Shortcut workflow");
	}

	async clickOnCommentsInProcessTable() {
		const commentButton = new XPathBuilder().anyElement().withLabel("Comments").atIndex(1).build();
		await this.baseInstance.clickElement(commentButton, "Comments button");
	}

	async clickOnRBYWorkflow() {
		this.baseInstance.rbyWorkflowName = await this.baseInstance.getText(elements.processTableFirstName);
		await this.baseInstance.clickElement(elements.processTableFirstName, "First requested by you Workflow");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickOnWOYWorkflow() {
		this.baseInstance.woyWorkflowName = await this.baseInstance.getText(elements.processTableFirstName);
		await this.baseInstance.clickElement(elements.processTableFirstName, "First waiting on you Workflow");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickOnStepInsideProgressModal() {
		await this.baseInstance.clickElement(elements.stepNode, "Step node");
		await this.baseInstance.clickElement(elements.stepNodeExpanded, "Step node expanded");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async progressModalIsDisplayed(): Promise<boolean> {
		return await this.baseInstance.isDisplayed(elements.statusModal);
	}

	async clickOnProgress() {
		await this.baseInstance.clickElement(elements.processTableFirstProgress, "Progress for first row");
		await this.baseInstance.waitForAppLoaderToDisappear();
	}

	async clickProfileIcon() {
		await this.baseInstance.clickElement(elements.userProfileDropdown, "userProfileDropdown");
	}

	async checkForButtonUnderProfileDropdown(ButtonText: string): Promise<boolean> {
		const xpath = elements.userProfileDropdownOption.replace("arg", capitalizeFirstChar(ButtonText));
		return await this.baseInstance.isDisplayed(xpath);
	}
}
