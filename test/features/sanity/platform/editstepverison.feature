@editstepversion
Feature: Workflow Status feature

    This feature checks step versioning is generated after sumbitting the step

    @editstepversion1
    Scenario: Verify step versioning is generated after sumbitting the step

        Given Set user as "Alzeenia"
        And User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button

        When User clicks create new button
        And User searches "AlzeeniaAutomationAssignment1" in create new search
        # Then Verify user is redirected to "new" workflow

        #verify completed workflow status
        And User clicks on the workflow step
        And  User fills workflow field "answer"
        And User submits step workflow
        And User clicks on the workflow step


        #verify user edit the fields data
        And User clicks on the worklfow step 
        And User clicks on the edit button
        And User clicks on the workflow field
        # And User enters {string} in workflowfield