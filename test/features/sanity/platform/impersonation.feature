@impr
Feature: Impersonation feature

    This feature tests scenarios for impersonation
    @impr1
    Scenario: Validate if can impersonate permission is not assigned to the user, View us button shouldn't be visible

        #verify view as button when permission is not assigned
        Given Set user as "admin User"
        When User redirects "admin" url
        When User enters username on admin page
        When User enters password on admin page
        When User clicks on login button on admin page
        Then Verify admin message is displayed
        When User clicks on "Users" from admin menu
        When user find the "Impersonate User" on admin page
        When user clicks on search button on admin page
        When user open the user data on admin page
        When user remove assigned user groups on admin page
        When user remove the assigned permission from user on admin page
        When User clicks on save button
        When User clicks on logout button on admin page
        #login to user to check view as button 
        Given Set user as "Impersonate User"
        When User redirects "platform" url
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        When user clicks on profile icon dropdown
        Then user checks for "View As" Button should "not" visible
        When User clicks on "Logout" from user profile dropdown

        #verify view as button when permission is assigned
        Given Set user as "admin User"
        When User redirects "admin" url
        When User enters username on admin page
        When User enters password on admin page
        When User clicks on login button on admin page
        Then Verify admin message is displayed
        When User clicks on "Users" from admin menu
        When user find the "Impersonate User" on admin page
        When user clicks on search button on admin page
        When user open the user data on admin page
        When user remove assigned user groups on admin page
        When user remove the assigned permission from user on admin page
        When user search for "krypton | user | Can impersonate other users" permission on admin page
        When user click on chooseall permission button on admin page
        When User clicks on save button
        When User clicks on logout button on admin page
        #login to user to check view as button 
        Given Set user as "Impersonate User"
        When User redirects "platform" url
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        When user clicks on profile icon dropdown
        Then user checks for "View As" Button should "be" visible

        #verify view as button when group without impersonation permission is assigned
        Given Set user as "admin User"
        When User redirects "admin" url
        When User enters username on admin page
        When User enters password on admin page
        When User clicks on login button on admin page
        Then Verify admin message is displayed
        When User clicks on "Users" from admin menu
        When user find the "Impersonate User" on admin page
        When user clicks on search button on admin page
        When user open the user data on admin page
        When user remove assigned user groups on admin page
        When user remove the assigned permission from user on admin page
        #AP don't have impersonation permission
        When user assign the user group "AP" on admin page
        When User clicks on save button
        When User clicks on logout button on admin page
        # #login to user to check view as button 
        Given Set user as "Impersonate User"
        When User redirects "platform" url
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        When user clicks on profile icon dropdown
        Then user checks for "View As" Button should "not" visible
        When User clicks on "Logout" from user profile dropdown


    @impr2
    Scenario: Validate impersonation feature and activity logs when group with permission are assigned
        #verify view as button when group with impersonation permission is assigned
        Given Set user as "admin User1"
        When User redirects "admin" url
        When User enters username on admin page
        When User enters password on admin page
        When User clicks on login button on admin page
        Then Verify admin message is displayed
        When User clicks on "Users" from admin menu
        When user find the "Impersonate User1" on admin page
        When user clicks on search button on admin page
        When user open the user data on admin page
        When user remove assigned user groups on admin page
        When user remove the assigned permission from user on admin page
        #ImpersonatioGroup have impersonation permission
        When user assign the user group "ImpersonationGroup" on admin page
        When user assign the user group "Admin" on admin page
        When User clicks on save button
        When User clicks on logout button on admin page
        #login to user to check view as button 
        Given Set user as "Impersonate User1"
        When User redirects "platform" url
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        When user clicks on profile icon dropdown
        Then user checks for "View As" Button should "be" visible
         
        #Check for view as certa user
        When User impersonates "Home Automation" as "Certa User"
        Then Verify user views as "Home Automation"

        #check for the view , undo , submitted, email activity logs for certa user while impersonation
        When User clicks create new button
        And User searches "activityLogAutomation" in create new search
        Then Verify user is redirected to "new" workflow
        And User clicks on "View Activity Log" option from workflow options
        Then Verify logs are displayed
            | logType | logDescription                                                                                                         | timestamp         | Index |
            | views   | Hina Impersonate1 viewed First step of activityLogAutomation on behalf of automation+homefeature@lvmelelj.mailosaur.net | a few seconds ago | 1     |
        And User enters "test" in "Name" field in workflow
        And User enters "activitylogs@lvmelelj.mailosaur.net" in "email" field in workflow
        And User submits workflow step
        And User clicks on "View Activity Log" option from workflow options
        Then Verify logs are displayed
            | logType            | logDescription                                                                                                                    | timestamp         | Index |
            | significant events | Hina Impersonate1 submitted First step of activityLogAutomation - Draft on behalf of automation+homefeature@lvmelelj.mailosaur.net | a few seconds ago | 1     |
            | edits              | Hina Impersonate1 submitted First step of activityLogAutomation - Draft on behalf of automation+homefeature@lvmelelj.mailosaur.net | a few seconds ago | 1     |
        And User clicks "First step" step on workflow page
        And User clicks edit step on workflow page
        And User clicks on "View Activity Log" option from workflow options
        Then Verify logs are displayed
            | logType            | logDescription                                                                                                               | timestamp         | Index |
            | significant events | Hina Impersonate1 undo First step of activityLogAutomation - Draft on behalf of automation+homefeature@lvmelelj.mailosaur.net | a few seconds ago | 1     |
            | edits              | Hina Impersonate1 undo First step of activityLogAutomation - Draft on behalf of automation+homefeature@lvmelelj.mailosaur.net | a few seconds ago | 1     |
        And User submits workflow step
        And User enters "1234" in "ID" field in workflow
        And User submits workflow step
        Then Verify workflow complete message is displayed
        And User clicks on "View Activity Log" option from workflow options
        Then Verify logs are displayed
            | logType            | logDescription                                                                                                                     | timestamp         | Index |
            | significant events | Hina Impersonate1 submitted Second Step of activityLogAutomation - Draft on behalf of automation+homefeature@lvmelelj.mailosaur.net | a few seconds ago | 1     |
            | edits              | Hina Impersonate1 submitted Second Step of activityLogAutomation - Draft on behalf of automation+homefeature@lvmelelj.mailosaur.net | a few seconds ago | 1     |
            | emails             | Email Deliveredto : activitylogs@lvmelelj.mailosaur.net                                                                            | a few seconds ago | 1     |
            | emails             | Email Queuedto : activitylogs@lvmelelj.mailosaur.net                                                                               | a few seconds ago | 2     |
        #Check Activity log with time stamp
        And User clicks "Second Step" step on workflow page
        And User clicks edit step on workflow page
        When Wait for 30 seconds
        When Wait for 30 seconds
        When Wait for 30 seconds
        When Wait for 30 seconds
        And User clicks on "View Activity Log" option from workflow options
        Then Verify logs are displayed
            | logType            | logDescription                                                                                                                | timestamp          | Index |
            | significant events | Hina Impersonate1 undo Second Step of activityLogAutomation - Draft on behalf of automation+homefeature@lvmelelj.mailosaur.net | 2 minutes ago      | 1     |
            | edits              | Hina Impersonate1 undo Second Step of activityLogAutomation - Draft on behalf of automation+homefeature@lvmelelj.mailosaur.net  | 2 minutes ago      | 1     |
        When User switches back to the original user
        
    @impr3
    Scenario: Validate external user and blacklisted user impersonation

        Given Set user as "Impersonate User2"
        When User redirects "platform" url
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        When user clicks on profile icon dropdown
        #Check for view as external user
        When User impersonates "Hina External" as "External User"
        Then Verify user views as "Hina External"
        When User switches back to the original user
        When User clicks on "Logout" from user profile dropdown

        # Check for the impersonation for blacklisted user
        # Steps for blacklisting user from admin panel
        Given Set user as "admin User"
        When User redirects "admin" url
        When User enters username on admin page
        When User enters password on admin page
        When User clicks on login button on admin page
        Then Verify admin message is displayed
        When User clicks "Config" from "Constance" on admin page
        When User add "Blacklist User" as blacklisted from admin page
        When User clicks on save button
        When User clicks on logout button on admin page

        #Check blacklisted user should not be impersonated
        Given Set user as "Impersonate User2"
        When User redirects "platform" url
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        When user clicks on profile icon dropdown
        Then check for "Blacklist User" in viewAs dropdown should "not" visible

        # Steps for removing user from blacklisting
        When User redirects "admin" url
        When User clicks "Config" from "Constance" on admin page
        When User remove the blacklisted user
        When User clicks on save button
        When User clicks on logout button on admin page

        #Check usser removed from blacklisted should be impersonated
        Given Set user as "Impersonate User2"
        When User redirects "platform" url
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        When user clicks on profile icon dropdown
        Then check for "Blacklist User" in viewAs dropdown should "be" visible


        