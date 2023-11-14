import { BaseClass } from "../../helpers/BaseClass";
import { getUserDetails } from "../../helpers/jsonHelper";
import { XPathBuilder } from "../../helpers/util/xpathBuilder";
import { elements } from "../../xpath/platform/loginPageElements";

export default class LoginPage {
	baseInstance: BaseClass;

	constructor(baseInstance: BaseClass) {
		this.baseInstance = baseInstance;
	}

	async openApplicationUrl() {
		await this.baseInstance.openURL(process.env.BASEURL);
	}

	async clickCertaAssociateButton() {
		await this.baseInstance.clickElement(elements.certaAssociateBtn, "Certa Associate button");
	}

	async clickLoginUsingEmailAndPasswordButton() {
		await this.baseInstance.clickElement(
			elements.loginUsingEmailAndPasswordBtn,
			"Login using e-mail and password button",
		);
	}

	async clickLoginButton() {
		await this.baseInstance.clickElement(elements.loginBtn, "Login button");
		await this.baseInstance.waitForAppLoaderToDisappear();
		await this.baseInstance.waitForPageToLoad();
	}

	async enterUsername() {
		await this.baseInstance.enterText(
			elements.usernameInput,
			(await getUserDetails(this.baseInstance.user)).username,
			"Username input",
		);
	}

	async enterPassword() {
		await this.baseInstance.enterText(
			elements.passwordInput,
			(await getUserDetails(this.baseInstance.user)).password,
			"Password input",
		);
	}

	async enterMFACode(code: string) {
		await this.baseInstance.wait(1);
		const xpath = new XPathBuilder().input().withLabel("Please enter verification code. Digit 1").build();
		await this.baseInstance.clickElement(xpath, "MFA code input");
		await this.baseInstance.keyboardType(code);
	}

	async getDisplayedError(): Promise<string> {
		const xpath = new XPathBuilder().div().withRole("alert").child().div().child().div().atIndex(2).build();
		return this.baseInstance.getText(xpath);
	}

	async checkMaintananceModeMessage(text: string): Promise<boolean> {
		const xpath = new XPathBuilder().anyElement().withText(text).build();
		return this.baseInstance.isDisplayed(xpath);
	}

	async checkOopsPage(): Promise<boolean>{
		const xpath = new XPathBuilder().span().withText("The server is under maintenance. Please check back in a few minutes.").build();
		return this.baseInstance.isDisplayed(xpath);
	}

	async checkLogout() {
		const url = this.baseInstance.getCurrentUrl();
		return (await url).includes("/login");
	}
}