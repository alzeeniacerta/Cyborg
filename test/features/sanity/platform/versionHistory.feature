@Stepversioning
Feature: Workflow Status feature

    This feature checks step versioning is generated after sumbitting the step

    @Stepversioning1
    Scenario: Verify step versioning is generated after sumbitting the step

        Given Set user as "Alzeenia"
        And User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button

        When User clicks create new button
        And User searches "StepVersioningAutomation" in create new search
        And User initiates a workflow for "StepVersioningAutomation"
        # Then Verify user is redirected to "new" workflow
       
        #verify completed workflow status
        And User clicks on the workflow step
        And  User fills workflow field "answer"
        And User submits step workflow
        And User clicks on the workflow step
        
    
        #verify step versioning creates after submit the step
        And User clicks on the meatball icon
        And User hover over the versioning History
        Then Verify step versioning is created "1"
        And User returns to workflow from version history dropdown
        #And User clicks on the workflow step

        #Verify user edit the field data
        And User clicks on the Edit button
        And User fills workflow field "answerworkflow"
        And User submits step workflow
        And User clicks on the workflow step
        And User clicks on the meatball icon
        And User hover over the versioning History
        Then Verify step versioning is created "2"