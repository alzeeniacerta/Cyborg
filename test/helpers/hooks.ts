import {
	After,
	Before,
	AfterAll,
	BeforeAll,
	BeforeStep,
	AfterStep,
	setDefaultTimeout,
	Status,
} from "@cucumber/cucumber";
import { Browser, BrowserContext } from "@playwright/test";
import { Base, baseInstance } from "./BaseClass";
import { invokeBrowser } from "./browserHelper";
import { setEnvFile } from "./environment/env";
import { createLogger } from "winston";
import { options } from "../helpers/util/logger";
import { CustomWorld } from "./customWorld";

let browser: Browser;
let browserContext: BrowserContext;

//Set default timeout of 60 seconds globally
setDefaultTimeout(60 * 1000);

/**
 * BeforeAll hook launches created a browser instance before starting suite execution
 */
BeforeAll(async function () {
	// Get enviroment from cli
	setEnvFile(baseInstance.getEnv());

	browser = await invokeBrowser();
});

/**
 * Before hook creates logs and launches a browser context and new page before every scenario
 */
Before(async function (this: CustomWorld, { pickle }) {
	// eslint-disable-next-line @typescript-eslint/no-this-alias
	Base.worldInstance = this;
	this.scenarioName = pickle.name + "_" + pickle.id;

	this.startTime = new Date();

	Base.logger = createLogger(options(this.scenarioName));
	Base.logger.info("Environment: " + process.env.npm_config_ENV);
	Base.logger.info("Browser type: " + process.env.npm_config_BROWSER);
	Base.logger.info("Start Time: " + this.startTime);

	const browserContextOptions = {
		...(process.env.npm_config_VIDEO == "true" ? { recordVideo: { dir: "test-results/videos/" } } : {}),
	};

	browserContext = await browser.newContext(browserContextOptions);
	Base.page = await browserContext.newPage();
	await baseInstance.openURL(process.env.BASEURL);
});

BeforeStep(async function () {
	//TODO:
});

/**
 * AfterStep hook will take screenshot if step fails
 */
AfterStep(async function ({ result }) {
	if (result.status !== Status.PASSED) {
		Base.logger.error("Step Name: " + Base.worldInstance.scenarioName);
		Base.logger.error("Step failed with error: " + result.exception);
		Base.logger.error("Message: " + result.exception.message + ", Error Type: " + result.exception.type);
		await baseInstance.takeScreenshot();
	}
});

/**
 * After hook closes the page
 */
After(async function ({ result }) {
	// const xpath = "//*[contains(text(),'Switch back to your user')]";
	// const closeIcon = "//span[@aria-label='Close']";
	// if(await baseInstance.exists(closeIcon)){
	// 	await baseInstance.exists(closeIcon, "Close Icon");
	// }
	// if(await baseInstance.exists(xpath)){
	// 	await baseInstance.clickElement(xpath, "switch back to user");
	// }
	// await baseInstance.waitForPageToLoad();
	Base.logger.info("Scenario status: " + result.status);
	await Base.page.close();
	await browserContext.close();
});

/**
 * AfterAll hook closes the browser and logger
 */
AfterAll(async function () {
	await browser.close();
});
