![image](https://github.com/Vetted/Cyborg/assets/141911052/4df6a957-0c3e-47be-bbf0-12275551101f)

# Cyborg

Cyborg is a powerful BDD automation framework built on top of Playwright, designed to streamline the testing of Platform & Studio 2.0 application. With Cyborg, you can automate end-to-end tests and ensure the quality of our application by efficiently executing test scenarios.

## Table of Contents

- Features
- Getting started
- Running tests
- CLI variables
- Structure
- Adding new features
- Xpath Builder
- Reporting
- CodeGen
- Debugging
- ESlint
- Git Hooks
- VS Code extensions
- Git Do's & Don'ts

## Features

- Utilizes Playwright's powerful browser automation capabilities.
- Modular page objects and element locators for better organization.
- Built-in support for Cucumber for writing BDD-style test scenarios.
- Configurable test runners for parallel execution.
- Custom utilities and helpers for common tasks.
- Generates detailed HTML reports for test results.

## Getting started

- Install [nodejs](https://nodejs.org/en/download)
- Install [git](https://git-scm.com/downloads)
- Create a folder in your machine where you want to store this project
  > **Note**
  > Make sure the folder has unrestricted access
- Open gitbash in the folder created
- Clone project

```bash
git clone https://github.com/Vetted/Cyborg.git
```

- Install dependencies

```bash
npm install
npx playwright install
```

Now you have successfully completed the setup

## Running tests

> **Note**
> Please use gitbash for execution as in powershell the report is not generated if the scenario fails

This framework is highly dynamic in terms of executing code. Select appropriate options while running the tests.

```bash
npm run test --ENV=QA --TAGS=@home
```

## CLI variables

We can set environment variable as described in `test/types/env.d.ts`.

- Environment `--Env=QA` mandatory - Environment in which you want to execute tests

  Any value other than the prescribed value will throw error as coded in `test/helpers/hooks.ts`

- Tags `--TAGS=@tag1 or @tag2` mandatory - Tags you want to run
- Browser `--BROWSER=chrome` optional - Browser on which test will be executed

  Valid values are `chrome`, `firefox` and `webkit`

- Headless `--HEADLESS=true` optional - Browser mode to execute the test

  Valid values are `true` and `false`. Default value is `false`

- Video `--VIDEO=true` optional - Records video for the execution which is saved in `test-results`

  Valid values are `true` and `false`. Default value is `false`

## Structure

### A top-level directory layout

    .
    ├── github\workflows\main.yml             # Used for post commit linting
    ├── husky                                 # Used for pre commit linting
    ├── .vscode
        ├── launch.json                       # Used for debugging
        ├── settings.json                     # Used for vscode setting (fix lint errors on ctrl+s)
    ├── config\cucumber.js                    # Main file for cucumber settings like parallelization
    ├── test
        ├── features                          # Contains cucumber features
        ├── helpers
            ├── environment                   # Contains environment files with env variables
            ├── report                        # Files for report generation
            ├── util                          # Conatain generic functions
            ├── BaseClass.ts                  # This contains all fundamental methods like click and enter text
            ├── browserHelper.ts              # Invokes browser
            ├── customWorld                   # Custom world to store scenrio specefic info
            ├── hooks.ts                      # Hooks are functions executed handelled executed by cucumber to manage workflow
            ├── jsonHelper                    # Helps to get json objects from test data
        ├── pages                             # Contain methods for each page
        ├── steps                             # Contains step files for each page
        ├── testData                          # Contains any test data
        ├── types                             # Contains process environment variable type
        ├── xpath                             # Contains xpaths for all pages
    ├── test-results                          # (gitignore) Contains reports, screenshots and videos
    ├── .eslintrc.js                          # ESlint config
    ├── .gitattributes
    ├── .gitignore                            # Contains ignored files for git
    ├── @rerun.txt                            # (gitignore) Contains failed scenarios
    ├── package-lock.json                     # packages
    ├── package.json                          # packages
    ├── README.md
    └── tsconfig.json                         # compiler options for ts

## Adding new features

> Things to keep in mind before creating a scenario
>
> - Ensure that the scenario you're automating is well-defined and clear. Ambiguous or unclear scenarios can lead to inaccurate test automation
> - Write clean and reusable code that can be used in future for any other scenario not just scenario it was originally coded for.
> - Use descriptive variable names and comments.
> - Try to create 1 action - 1 step.
> - Ensure that one test doesn't impact another.
> - Use meaningful assertions to validate the expected outcomes of each test step in step files.
> - Implement proper error handling and reporting mechanisms to provide clear insights when tests fail especicially for base class methods.

- First create a new feature file under the appropriate feature subfolder
  > Note: If you are automating any page which has been worked on before, try to find existing steps. If not present only then create new one. If present then try to utlise the old method with some modification which will work everywhere.
  ```Gherkin
    @dashboard
    Feature: Dashboard feature
    This feature tests scenarios at dashboard tab
    Scenario: Dashboard verification using aman
        Given Set user as "AmanExternal"
        And User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        Then Verify create new is displayed
        And User clicks on dashboard button
        Then Verify dashboard page is displayed
  ```
- Add the method to their appropriate file for example if `And User clicks on login button` step is executed on login page then add this step definition in `loginPage.ts`.

  > Note: All pages should have a constructor with baseInstance as parameter to use only 1 instance of baseclass throughout the scenario and pages

  ```typescript
  export default class LoginPage {
  	baseInstance: BaseClass;

  	constructor(baseInstance: BaseClass) {
  		this.baseInstance = baseInstance;
  	}

  	async clickLoginButton() {
  		await this.baseInstance.clickElement(elements.loginBtn, "Login button");
  		await this.baseInstance.waitForAppLoaderToDisappear();
  	}
  }
  ```

- Add the steps to their appropriate file for example if `And User clicks on login button` step is executed on login page then add this step definition in `loginSteps.ts`.

  > Note: All step files should import the baseInstance from BaseClass and pass as parameter while creating object of respective page class

  ```typescript
  import { When } from "@cucumber/cucumber";
  import LoginPage from "../pages/loginPage";
  import { baseInstance } from "../helpers/BaseClass";

  const loginPage: LoginPage = new LoginPage(baseInstance);

  When("User clicks on login button", async function () {
  	await loginPage.clickLoginButton();
  });
  ```

- If your respective element interaction method is not present only then add method in base class as shown
  > Note: Please make sure to add comments for your base class methods
  ```typescript
    /**
     * This method is used to click element
     * @param xpath xpath of the element
     * @param object name of the element
     */
    async clickElement(xpath: string, object: string) {
      await this.waitForElement(xpath);
      try {
        await Base.page.locator(xpath).click();
        Base.logger.info("Clicked on " + object + " with xpath " + xpath);
      } catch (error) {
        Base.logger.error("Error clicking element: " + xpath + " : " + error);
      }
    }
  ```

## Xpath Builder

Xpath builder is a utility that can be used to create xpaths on the fly.

### Examples

```typescript
let xpath = new XPathBuilder()
	.anyElement()
	.withLabel("Messages")
	.atIndex(2)
	.build();
```

For above code `xpath ` will be

`(//*[@aria-label='Messages'])[2]`

```typescript
let xpath = new XPathBuilder()
	.span()
	.withLabel("Messages")
	.followingSibling()
	.div()
	.withClass("menuitem")
	.withPlaceholder("Enter message...")
	.build();
```

For above code `xpath ` will be

`//span[@aria-label='Messages']/following-sibling::div[@class="menuitem"][@placeholder="Enter message..."]`

## Reporting

This framework uses [cucumber html report](https://www.npmjs.com/package/cucumber-html-reporter) for report generation. Cucumber generates a cucumber.json file after execution which is used to generate html report. Report generator and config can be found under `test/helpers/report/reportHelper.ts`

Reports will be generated under `test-results/report`

Here are some screenshots of the report
![image](https://github.com/Vetted/Cyborg/assets/141911052/61bb6269-e4a1-41c5-b1f9-77294a8341fd)
![image](https://github.com/Vetted/Cyborg/assets/141911052/f7fad948-97f8-485d-a722-cbfd3e79ef70)

## Logger

This framework uses [winston](https://github.com/winstonjs/winston) logger to log actions and errors being performed. Config files can be found under `test/helpers/util/logger.ts`. Logger will generate different log files for each scenario to support parallel run.

Logs will be generated under `test-results/logs`

## CodeGen

Codegen is a powerful tool that generates code for any operation executed on browser. This tool helps to remove blockers such as ambiguity on how to automate something.

```bash
npx playwright codegen https://internal.slackcart.com/
```

## Debugging

Debug configuration can be found under `.vscode/launch.json`. We can go tio run and debug tab on the left and select `Cucumber Debug` option from the dropdown and run. The runtime arguments present in the config file will run
the mentioned scenario in debug mode and hit breakpoints during execution.

```json
"runtimeArgs": [
        "run",
        "test",
        "--ENV=QA",
        "--BROWSER=chrome",
        "--HEADLESS=false",
        "--TAGS=@home2"
      ],
```

## ESlint

ESlint is a library that helps you fix errors in your code and enforce coding rules to produce consistent quality code.

Some of the rules used in this project are-

- Use of tab for indentation
- Use of double quotes for string
- Mandatory use of semicolon

Extended plugins used

- @typescript-eslint/eslint-plugin
- eslint-plugin-playwright

Commands

- Finding errors
  ```bash
  npx eslint .
  ```
- Fixing errors
  ```bash
  npm run lint
  ```
  or
  ```bash
  npx eslint . --fix
  ```

## Git Hooks

There are two types of hooks configured in this project pre-commmit and post commit. The hooks will automatically fix minor error in the project.

- Pre commit hook

  This will check for errors and fix them whenever someone will commit some code. Pre commit config can be found under `.husky/pre-commit`

- Post push hook

  This is handled by github actions. This will fix any errors found in the pushed code. Config can be found under `github/workflows/main.yml`

## VS Code extensions

- ms-vscode.vscode-typescript-next - Typescript Support
- alexkrechik.cucumberautocomplete - Cucumber support
- dbaeumer.vscode-eslint - Eslint integration
- usernamehw.errorlens - Improve highlighting of errors, warnings and other language diagnostics
- GitHub.copilot - AI pair programmer

## Git Do's & Don'ts

Do's

- Always create a new branch for every new feature or scenario
- Regularly commit and push changes to the remote branch to avoid loss of work.
- Always commit changes with a concise and useful commit message.
- Always create a pull request for merging changes from one branch to another with an approver.
- Always review your code once by yourself before creating a pull request.
- Delete branches if a feature is merged to the main branch

Don'ts

- Don’t commit directly to the main branches.
- Never commit application secrets.
- Don’t commit large files in the repository.
- Don’t work on multiple features in the same branch
- Don’t do a force push until you’re extremely comfortable performing this action
- Don't modify the repository
