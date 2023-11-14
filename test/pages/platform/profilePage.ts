import { BaseClass } from "../../helpers/BaseClass";
import { elements } from "../../xpath/platform/profilePageElements";

export default class ProfilePage {
	baseInstance: BaseClass;

	constructor(baseInstance: BaseClass) {
		this.baseInstance = baseInstance;
	}

	async getUserEmail() {
		return await this.baseInstance.getHtmlAttributeByXPath(elements.emailInput, "value");
	}

	async getUserLastName() {
		return await this.baseInstance.getHtmlAttributeByXPath(elements.lastNameInput, "value");
	}

	async getUserFirstName() {
		return await this.baseInstance.getHtmlAttributeByXPath(elements.firstNameInput, "value");
	}
}
