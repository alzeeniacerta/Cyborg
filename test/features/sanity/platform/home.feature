@home
Feature: Home feature

    This feature tests scenarios at home page

    @home1
    Scenario: Basic home page elements verification
        Given Set user as "Aman"
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        Then Verify create new is displayed

        # Welcome message verification
        Then Verify welcome message is displayed
        Then Verify hello user message is displayed

        # Footer verification
        Then Verify footer is displayed

        # Verify user avatar
        Then Verify user avatar is displayed

        # Search field verification
        Then Verify search field is displayed
        Then Take screenshot

        # Advanced search verification
        And User clicks on search field
        And User clicks on Advanced Search
        Then Verify advanced search is displayed

        # Help button verification
        Then Verify help button is displayed
        When User clicks on help button
        Then Verify user is redirected to "https://google.com" on when user clicks on "Faq" option

        # Recent workflows verification
        And User clicks tenant logo
        Then Verify recent workflows is displayed
        When User clicks on "recent" workflow
        Then Verify user is redirected to "recent" workflow
        Then Take screenshot

        # Starred workflow verification
        And User clicks tenant logo
        When User clicks on "starred" workflow
        Then Verify user is redirected to "starred" workflow
        Then Take screenshot

        # Profile verification
        And User clicks home button
        When User clicks on "profile" from user profile dropdown
        Then Verify user first name is displayed
        Then Verify user last name is displayed
        Then Verify user email is displayed

        # Shortcuts verification
        And User clicks home button
        When User clicks on "shortcut" workflow
        Then Verify user is redirected to "shortcut" workflow
        Then Take screenshot

        # Waiting on you verification
        And User clicks home button
        When User clicks on "waiting on you" workflow
        Then Verify user is redirected to "waiting on you" workflow
        Then Take screenshot

        # Status modal verification
        And User clicks home button
        When User clicks on progress of workflow
        Then Verify progress modal is displayed
        Then Take screenshot
        When User clicks on step inside progress modal
        Then Verify user is redirected to "waiting on you" workflow

        # Requested by you verification
        And User clicks home button
        And User clicks on requested by you button
        When User clicks on "requested by you" workflow
        Then Verify user is redirected to "requested by you" workflow
        Then Take screenshot

    @home2
    Scenario: Home page process table verification
        Given Set user as "AmanExternal"
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        Then Verify create new button is displayed

        # Waiting on you verification
        And User clicks home button
        And User clicks on waiting on you button
        Then Verify process table headers
        And User sorts "status" field
        Then Verify records are sorted by "status" field

        # Requested by you verification
        And User clicks on requested by you button
        Then Verify process table headers

        # Filter existing values
        # case sensitive
        When User enters filter and clicks search
            | Field  | Value       |
            | name   | draft       |
            | status | In Progress |
        Then Verify filters are applied
            | Field  | Value       | Result expected | Verify filter Tags |
            | name   | draft       | true            | true               |
            | status | In Progress | true            | true               |
        And Take screenshot
        And User clicks on clear filter button

        # Filter non existing values
        # case sensitive
        When User enters filter and clicks search
            | Field | Value |
            | name  | pasta |
        Then Verify filters are applied
            | Field | Value | Result expected | Verify filter Tags |
            | name  | pasta | false           | true               |
        And Take screenshot

        # Count mentions
        And User clicks on user mentions icon
        Then Verify total number of mentions "before commenting"

        When User impersonates "Home Automation" as "Certa User"
        Then Verify user views as "Home Automation"

        # Create new workflow
        When User clicks create new button
        And User searches "testarc" in create new search
        And User mentions "Aman External" on "step" comment
        And User mentions "Aman External" on "field" comment
        When User clicks in all comments button
        Then Verify all workflow comments
        Then Verify user is redirected to "new" workflow
        And User assigns step to "Aman External"
        Then Verify step is assigned to "Aman External"
        Then User switches back to the original user

        # Verify comments count after commenting
        And User clicks home button
        And User clicks on user mentions icon
        Then Verify total number of mentions "after commenting"
        Then Verify home mentions badge

        # Verify comments for waiting on you
        And User clicks on waiting on you button
        And User clicks on comments in process table
        Then Verify all workflow comments

        # Archive waiting on you worflows
        And Count the number of "assigned" tasks
        Then Verify task count is equal to tasks assigned
        Then Verify pagination message for "assigned" tasks
        When User archives workflow
        Then Verify "assigned" workflow is archived

        # Create new workflow
        When User clicks create new button
        And User searches "testarc" in create new search
        Then Verify user is redirected to "new" workflow
        And User mentions "Home Automation" on "step" comment
        And User mentions "Home Automation" on "field" comment

        # Verify comments for requested by you
        And User clicks home button
        And User clicks on requested by you button
        And User clicks on comments in process table
        Then Verify all workflow comments

        # Archive requested worflows
        And User clicks on requested by you button
        And Count the number of "requested" tasks
        Then Verify pagination message for "requested" tasks
        When User archives workflow
        Then Verify "requested" workflow is archived

    @home3
    Scenario: MFA verification
        Given Set user as "MFA User"

        #Enable MFA
        When User redirects "admin" url
        And User enters username on admin page
        And User enters password on admin page
        And User clicks on login button on admin page
        Then Verify admin message is displayed

        And User clicks on "Configurations" from admin menu
        And User clicks on config from admin menu
        And User "checks" MFA checkbox
        And User clicks on save button
        And User clicks on logout button on admin page

        # Login with MFA
        Then User redirects "platform" url
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        And Wait for 2 seconds
        And User clicks on login button
        Then Validate error "Please enter a valid 6 digit code"
        And User enters incorrect MFA code
        And User clicks on login button
        Then Validate error "Invalid/Expired code. Please try again"
        And User enters correct MFA code
        And User clicks on login button
        Then Verify create new button is displayed

        # Disable MFA
        And User redirects "admin" url
        And User clicks on "Configurations" from admin menu
        And User clicks on config from admin menu
        And User "unchecks" MFA checkbox
        And User clicks on save button
        And User clicks on logout button on admin page