import {  BaseClass } from "../../helpers/BaseClass";
// import { capitalizeFirstChar } from "../../helpers/util/basic";
// import { XPathBuilder } from "../../helpers/util/xpathBuilder";
import { element } from "../../xpath/platform/stepversioningPageElements";


export default class Stepversioning{
	waitForAppLoaderToDisappear() {
		throw new Error("Method not implemented.");
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	wait(arg0: number) {
		throw new Error("Method not implemented.");
	}
	editbuttonupdated() {
		throw new Error("Method not implemented.");
	}
	baseInsatance: BaseClass;

	constructor(baseInstance:BaseClass){
		this.baseInsatance=baseInstance;
	}

	async clicOnkWorkflowStep(){
		await this.baseInsatance.wait(3);
		await this.baseInsatance.clickElement(element.clicOnkWorkflowStep, "Workflow Step");
	}

	async enterFieldData(answer:string){
		await this.baseInsatance.enterText(element.enterFieldData, answer, "alzeenia");
       
	}

	async clickOnSubmitButton(){
		await this.baseInsatance.clickElement(element.clickOnSubmitButton,"Workflowsubmit button");
		await this.baseInsatance.waitForAppLoaderToDisappear();
		// await this.waitForTimeout();
		// await this.waitForSelector('input#username', { state: 'visible', timeout: 5000 });
	
	}
  
	async clickOnMeatballicon(){
		await this.baseInsatance.clickElement(element.clickOnMeatballicon,"Workflowsubmit button");
	
	}
	async hoverVersionHistory(){
		await this.baseInsatance.hoverOverElement(element.hoverVersionHistory);
	
	}
	async closeStepVersioningDropdown(){
		await this.baseInsatance.wait(2);
		await this.baseInsatance.keyboardPress("Escape");
	}
	async clickOnEditButton(){
		await this.baseInsatance.wait(2);
		console.log("Will click EDIT BUTTON now");
		await this.baseInsatance.clickElement(element.clickOnEditButton,"click on edit button");
		console.log("Clicked on EDIT BUTTON now");
	}
	async verifyVersionHistoryCreated(version: string){
		console.log(element.verifyVersionHistoryCreated.replace("?", version));
		await this.baseInsatance.wait(2);
		await this.baseInsatance.clickElement(element.verifyVersionHistoryCreated.replace("?", version), "verify Version History Created");
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async updatedfielddata(update:string){
		await this.baseInsatance.clickElement(element.updatedfielddata," verifyVersionHistoryCreated");
	}
}