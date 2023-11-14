@WorkflowStatus
Feature: Workflow Status feature

    This feature checks if Workflow status works fine or not

    @WorkflowStatus1
    Scenario: Verify WF status changes with WF progression

        Given Set user as "Abdullah"
        And User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button

        When User clicks create new button
        And User searches "Workflow status" in create new search
        Then Verify user is redirected to "new" workflow

        #Verify every workflow should have any workflow status.
        Then verify Workflow has some status

        #Verify the in progress workflow status
        And User enters "random texts" in "field1" field
        Then Verify workflow status is "IN PROGRESS"
        
        #verify completed workflow status
        And User enters "random texts" in "field2" field
        When User submits workflow step
        Then Verify workflow status is "COMPLETED"



