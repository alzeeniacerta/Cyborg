import { Base, BaseClass } from "../../helpers/BaseClass";
import { getUserDetails } from "../../helpers/jsonHelper";
import { capitalizeFirstChar } from "../../helpers/util/basic";
import { XPathBuilder } from "../../helpers/util/xpathBuilder";
import { elements } from "../../xpath/platform/homePageElements";

export default class AdminPage {
	baseInstance: BaseClass;

	constructor(baseInstance: BaseClass) {
		this.baseInstance = baseInstance;
	}

	async adminMessageIsDisplayed() {
		return this.baseInstance.isDisplayed(new XPathBuilder().h1().containsText("Certa administration").build());
	}

	async clickOptionFromAdminMenu(option: string) {
		const xpath = new XPathBuilder().a().containsText(capitalizeFirstChar(option)).build();
		await this.baseInstance.clickElement(xpath,"Click on " + option + " from admin menu");
		await this.baseInstance.waitForPageToLoad();
	}

	async selectConfiguration(option: string) {
		const xpath = new XPathBuilder().a().withText(capitalizeFirstChar(option)).atIndex(1).build();
		await this.baseInstance.clickElement(xpath, "Click on " + option + " from admin menu");
		await this.baseInstance.waitForPageToLoad();
	}

	async turnOnMFA() {
		const xpath = new XPathBuilder().input().withName("is_mfa_required").build();
		await this.baseInstance.checkCheckbox(xpath);
	}

	async turnOffMFA() {
		const xpath = new XPathBuilder().input().withName("is_mfa_required").build();
		await this.baseInstance.uncheckCheckbox(xpath);
	}

	async clickSaveButton() {
		const xpath = new XPathBuilder().input().withValue("Save").build();
		await this.baseInstance.clickElement(xpath, "Click on save button");
		await this.baseInstance.waitForPageToLoad();
	}

	async enterPassword() {
		const xpath = new XPathBuilder().input().withName("password").build();
		await this.baseInstance.enterText(xpath, (await getUserDetails(this.baseInstance.user)).password, "Admin username");
	}

	async enterUsername() {
		const xpath = new XPathBuilder().input().withName("username").build();
		await this.baseInstance.enterText(xpath, (await getUserDetails(this.baseInstance.user)).username, "Admin password");
	}

	async clickLoginButton() {
		const xpath = new XPathBuilder().input().withValue("Log in").build();
		await this.baseInstance.clickElement(xpath, "Login button");
	}

	async clickLogoutButton() {
		const xpath = new XPathBuilder().a().containsText("Log out").build();
		await this.baseInstance.clickElement(xpath,"Logout button");
		await this.baseInstance.waitForPageToLoad();
	}

	async findUser(user:string) {
		this.baseInstance.user = user;
		const xpath = new XPathBuilder().input().withId("searchbar").build();
		await this.baseInstance.enterText(xpath,(await getUserDetails(this.baseInstance.user)).email, "search user");
	}
	
	async clickSearchButton() {
		const xpath = new XPathBuilder().input().withValue("Search").build();
		await this.baseInstance.clickElement(xpath, "Search Icon");
	}

	async openUserData() {
		const xpath =  new  XPathBuilder().th().withClass("field-email").build();
		await this.baseInstance.clickElement(xpath, "user data");
		await this.baseInstance.waitForPageToLoad();
	}

	async removeUserGroups() {
		const xpath = new XPathBuilder().input().withName("groups").build();
		await this.baseInstance.clearText(xpath, "User groups");
	}
	
	async removeAssignedPermission() {
		const xpath = new XPathBuilder().a().withId("id_user_permissions_remove_all_link").build();
		if(await this.baseInstance.isEnabled(xpath)){
			await this.baseInstance.clickElement(xpath, "remove all permission");
		}
	}

	async searchPermission(permission: string) {
		const xpath = new XPathBuilder().input().withId("id_user_permissions_input").build();
		await this.baseInstance.enterText(xpath, permission, "seach for permission");
	}

	async clickChooseAllButton() {
		const xpath = new XPathBuilder().a().withId("id_user_permissions_add_all_link").build();
		await this.baseInstance.clickElement(xpath, "choose all button");
	}

	async assignUserGroup(group:string) {
		const searchGroupIcon = new XPathBuilder().a().withId("lookup_id_groups").build();
		const popupPromise = Base.page.waitForEvent("popup");
		await this.baseInstance.clickElement(searchGroupIcon, "search group icon");
		const searchInput = new XPathBuilder().input().withId("searchbar").build();
		const popup = await popupPromise;
		await popup.locator(searchInput).fill(group);
		const searchButton = new XPathBuilder().input().withValue("Search").build();
		await popup.locator(searchButton).click();
		const userGroup = new XPathBuilder().a().containsText(group).atIndex(1).build();
		await popup.locator(userGroup).click();
	}

	async blackListUser(user: string) {
		this.baseInstance.user = user;
		const xpath = new XPathBuilder().input().withId("id_USER_IMPERSONATION_BLACKLIST").build();
		await this.baseInstance.clearText(xpath, "Blacklist User");
		await this.baseInstance.enterText(xpath,(await getUserDetails(this.baseInstance.user)).email, "Blacklisted User");
	}

	async checkUserInViewAsUserList(user: string) {
		this.baseInstance.user = user;
		const xpath = new XPathBuilder().div().withText("View As").build();
		await this.baseInstance.clickElement(xpath, "view as");
		await this.baseInstance.keyboardPress("ArrowRight");
		await this.baseInstance.keyboardPress("ArrowRight");
		await this.baseInstance.enterText(elements.searchViewAsUserInput, (await getUserDetails(this.baseInstance.user)).email, "Search view as user input field");
		return this.baseInstance.isDisplayed(new XPathBuilder().span().containsText((await getUserDetails(this.baseInstance.user)).email).build());
	}

	async ChooseOptionFromAdminMenu(option: string, parent: string) {
		//a[contains(text(),'Vetted lite platform')]//parent::caption//following-sibling::tbody//a[contains(text(),'Users')]
		const xpath = new XPathBuilder().a().containsText(capitalizeFirstChar(parent)).parent().caption().followingSibling().tbody().child().tr().child().th().child().a().containsText(capitalizeFirstChar(option)).build();
		Base.logger.info("xpath" + xpath);
		await this.baseInstance.clickElement(xpath,"Click on " + option + " from admin menu");
		await this.baseInstance.waitForPageToLoad();
	}

	async removeBlacklistedUser() {
		const xpath = new XPathBuilder().input().withId("id_USER_IMPERSONATION_BLACKLIST").build();
		await this.baseInstance.clearText(xpath, "Blacklist User");
	}

	async turnOnMaintananceMode() {
		const xpath = new XPathBuilder().input().withId("id_is_maintenance_mode_enabled").build();
		await this.baseInstance.checkCheckbox(xpath);
	}

	async turnOffMaintananceMode() {
		const xpath = new XPathBuilder().input().withId("id_is_maintenance_mode_enabled").build();
		await this.baseInstance.uncheckCheckbox(xpath);
	}

	async addWhiteListUser(user: string) {
		this.baseInstance.user = user;
		const xpath = new XPathBuilder().input().withId("id_whitelisted_users_in_maintenance_mode").build();
		await this.baseInstance.clearText(xpath, "Whitelist User");
		await this.baseInstance.enterText(xpath,(await getUserDetails(this.baseInstance.user)).email, "Whitelist User");
	}

	async successMessageIsDisplayed() {
		return this.baseInstance.isDisplayed(new XPathBuilder().li().withText("The configuration “").build());
	}

	async clickOnConfigFromAdminMenu() {
		const xpath = new XPathBuilder().a().withHref("/admin/common/configuration/1/change/").build();
		await this.baseInstance.clickElement(xpath, "Configuration");
	}
}