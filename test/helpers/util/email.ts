import Mailosaur = require("mailosaur");
import { Base, baseInstance } from "../BaseClass";
import { SearchCriteria, SearchOptions } from "mailosaur/lib/models";

let emailId = "";
let mailosaurClient: Mailosaur;
const mailosaurServerId = "lvmelelj";

async function setupConnection(apiKey: string) {
	try {
		mailosaurClient = new Mailosaur(apiKey);
	} catch (error) {
		baseInstance.customLog("Error while setting up connection: " + error);
	}
}

async function getEmail(recipient: string, subject: string) {
	// const sender = getSenderEmailId();
	await setupConnection(process.env.MAILOSAUR_API_KEY);
	try {
		const searchCriteria: SearchCriteria = {
			// sentFrom: sender,
			sentTo: recipient,
			subject: subject,
		};

		const searchOptions: SearchOptions = {
			receivedAfter: Base.worldInstance.startTime, // Replace with your desired timestamp
		};

		const emailList = await mailosaurClient.messages.search(mailosaurServerId, searchCriteria, searchOptions);
		baseInstance.customLog("Number of emails: " + emailList.items.length);

		// Save email id for deletion
		emailId = emailList.items[0].id;
		return await mailosaurClient.messages.getById(emailId);
	} catch (error) {
		Base.logger.error("Error while getting email: " + error);
	}
}

export async function getEmailBody(recipient: string, subject: string): Promise<string> {
	const emailBody = (await getEmail(recipient, subject)).text.body;
	baseInstance.customLog(emailBody);
	return emailBody;
}

export async function getLinkFromEmail(recipient: string, subject: string): Promise<string> {
	const emailLink = (await getEmail(recipient, subject)).html.links[0].href;
	await deleteEmail(emailId);
	baseInstance.customLog(emailLink);
	return emailLink;
}

async function deleteEmail(emailId: string) {
	baseInstance.customLog("Email id: " + emailId);
	await mailosaurClient.messages.del(emailId);
}

// function getSenderEmailId() {
// 	switch (process.env.npm_config_ENV) {
// 		case "SC":
// 			return "noreply@getcerta.com";
// 		case "STAGING":
// 			return "noreply@thevetted.com";
// 		default:
// 			throw ("Please specify 'SC' or 'STAGING' environement");
// 	}
// }

export async function verifyEmailContent(
	recipient: string,
	subject: string,
	contentList: string[][],
): Promise<boolean> {
	for (const content of contentList) {
		const emailContent = await getEmailBody(recipient, subject);
		if (!emailContent.includes(content[0])) {
			return false;
		}
	}
	await deleteEmail(emailId);
	return true;
}
