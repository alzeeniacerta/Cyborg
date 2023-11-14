@MainMode
Feature: Maintanance Mode feature

    This feature tests scenarios for Maintanance mode
    @MainMode1
    Scenario: Validate if maintanance message is visible on login page when maintanance mode is enabled

        Given Set user as "Maintanance Mode User"
        When User redirects "admin" url
        When User enters username on admin page
        When User enters password on admin page
        When User clicks on login button on admin page
        Then Verify admin message is displayed
        And User clicks on "Configurations" from admin menu
        When User select "Certa" configuration from list
        And User "enable" maintanance mode
        And User add "Whitelist User" in whitelisted user
        And User clicks on save button 
        Then user verify success messgae

        #Check user gets logged out as user is not added in whiteliested user
        Then check user gets logged out

        #check maintanance mode message on admin login page
        Then User checks for "Hi Testing Maintenance Mode please contact Abdullah" text on login page should "be" visible

        #check maintanance mode message on login page
        Then User redirects "platform" url
        Then User checks for "Hi Testing Maintenance Mode please contact Abdullah" text on login page should "be" visible

        #check non whitelisted user should not able to login
        Given Set user as "Maintanance Mode User"
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        When user checks for Oops page

        #Check whitelisted user should be able to logged in
        Given Set user as "Whitelist User"
        Then User redirects "platform" url
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        Then Verify user avatar is displayed

        #Disable the maintanance mode and check for message on admin page
        When User redirects "admin" url
        And User clicks on "Configurations" from admin menu
        When User select "Certa" configuration from list
        And User "disable" maintanance mode
        And User clicks on save button 
        Then user verify success messgae
        When User clicks on logout button on admin page
        When User redirects "admin" url
        Then User checks for "Hi Testing Maintenance Mode please contact Abdullah" text on login page should "not" visible

        #Disable the maintanance mode and check for messgae on login page
        Then User redirects "platform" url
        Then User checks for "Hi Testing Maintenance Mode please contact Abdullah" text on login page should "not" visible

        #check any user should be able to login after disabling the maintanance mode
        Given Set user as "admin User"
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        Then Verify user avatar is displayed