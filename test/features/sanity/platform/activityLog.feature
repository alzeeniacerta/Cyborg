@activityLog
Feature: Activity Log feature

    This feature tests activity logs

    @activityLog1
    Scenario: Verify logs for a new workflow
        Given Set user as "Activity Logs"
        And User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button

        When User clicks create new button
        And User searches "activityLogAutomation" in create new search
        Then Verify user is redirected to "new" workflow
        And User clicks on "View Activity Log" option from workflow options
        Then Verify logs are displayed
            | logType | logDescription                                                                 | timestamp         | Index |
            | views   | activitylogs@lvmelelj.mailosaur.net viewed First step of activityLogAutomation | a few seconds ago | 1     |
        And User enters "test" in "Name" field with tag "input" in workflow
        And User enters "activitylogs@lvmelelj.mailosaur.net" in "email" field with tag "input" in workflow
        And User submits workflow step
        And User clicks on "View Activity Log" option from workflow options
        Then Verify logs are displayed
            | logType            | logDescription                                                                            | timestamp         | Index |
            | significant events | activitylogs@lvmelelj.mailosaur.net submitted First step of activityLogAutomation - Draft | a few seconds ago | 1     |
            | edits              | activitylogs@lvmelelj.mailosaur.net submitted First step of activityLogAutomation - Draft | a few seconds ago | 1     |
        And User clicks "First step" step on workflow page
        And User clicks edit step on workflow page
        And User clicks on "View Activity Log" option from workflow options
        Then Verify logs are displayed
            | logType            | logDescription                                                                       | timestamp         | Index |
            | significant events | activitylogs@lvmelelj.mailosaur.net undo First step of activityLogAutomation - Draft | a few seconds ago | 1     |
            | edits              | activitylogs@lvmelelj.mailosaur.net undo First step of activityLogAutomation - Draft | a few seconds ago | 1     |
        And User submits workflow step
        And User enters "1234" in "ID" field with tag "input" in workflow
        And User submits workflow step
        Then Verify workflow complete message is displayed
        And User clicks on "View Activity Log" option from workflow options
        Then Verify logs are displayed
            | logType            | logDescription                                                                             | timestamp         | Index |
            | significant events | activitylogs@lvmelelj.mailosaur.net submitted Second Step of activityLogAutomation - Draft | a few seconds ago | 1     |
            | edits              | activitylogs@lvmelelj.mailosaur.net submitted Second Step of activityLogAutomation - Draft | a few seconds ago | 1     |
            | emails             | Email Deliveredto : activitylogs@lvmelelj.mailosaur.net                                    | a few seconds ago | 1     |
            | emails             | Email Queuedto : activitylogs@lvmelelj.mailosaur.net                                       | a few seconds ago | 2     |
        Then Verify content in email sent to "user" with subject "Activity log automation"
            | Text to verify                                                         |
            | Hello test                                                             |
            | You are receiving this email after successful submission of this step. |
            | ID - 1234                                                              |
        And User clicks on "View Activity Log" option from workflow options
        And User downloads logs
        Then Verify downloaded logs
            | Workflow ID | Workflow Name | Step                    | Action         | Username      | User Email                          | Time    | Field Name | Old Value | New Value | Event |
            | dynamic     | Draft         | First Step              | step viewed    | Activity Logs | activitylogs@lvmelelj.mailosaur.net | dynamic |            |           |           |       |
            | dynamic     | Draft         | Second Step             | step viewed    | Activity Logs | activitylogs@lvmelelj.mailosaur.net | dynamic |            |           |           |       |
            | dynamic     | Draft         | First Step              | step submitted | Activity Logs | activitylogs@lvmelelj.mailosaur.net | dynamic |            |           |           |       |
            | dynamic     | Draft         | Second Step             | step submitted | Activity Logs | activitylogs@lvmelelj.mailosaur.net | dynamic |            |           |           |       |
            | dynamic     | Draft         | First Step              | step undo      | Activity Logs | activitylogs@lvmelelj.mailosaur.net | dynamic |            |           |           |       |
            | dynamic     | Draft         | Activity log automation | sendgrid email |               |                                     | dynamic |            |           |           |       |