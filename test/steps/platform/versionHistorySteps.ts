import { When  } from "@cucumber/cucumber";
import { Then  } from "@cucumber/cucumber";

// import * as assert from "assert";
import { baseInstance } from "../../helpers/BaseClass";
// import { getDate } from "../../helpers/util/basic";
// import Stepversioning from "../../pages/platform/versionHistoryPage";
import Stepversioning from "../../pages/platform/versionHistoryPage";


const stepversioning: Stepversioning = new Stepversioning(baseInstance);

When("User clicks on the workflow step", async function() {
	await stepversioning.clicOnkWorkflowStep();

});

When( "User fills workflow field {string}", async function(answer:string) {
	await stepversioning.enterFieldData(answer);

});

When( "User submits step workflow", async function() {
	await stepversioning.clickOnSubmitButton();

});

When("User clicks on the meatball icon", async function() {
	await stepversioning.clickOnMeatballicon();

});
When("User hover over the versioning History", async function() {
	await stepversioning.hoverVersionHistory();
	// await stepversioning.wait(1);
	// await stepversioning.waitForAppLoaderToDisappear();
});

// When("User clicks on the Edit button",async function(){
// 	await stepversioning.clickOnEditButton();
// });

Then("Verify step versioning is created {string}",async function(version: string){
	await stepversioning.verifyVersionHistoryCreated(version);
});

When("User returns to workflow from version history dropdown", async function(){
	await stepversioning.closeStepVersioningDropdown();
});

When("User clicks on the Edit button",async function(){
	await stepversioning.clickOnEditButton();
});

When("User fills workflow field '{string}'",async function(update:string){
	await stepversioning.updatedfielddata(update);
});


