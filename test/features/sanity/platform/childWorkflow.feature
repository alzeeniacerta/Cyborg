@ChildWorkflow
Feature: Child Workflow feature

    This feature tests scenarios for child workflow creation
    @ChildWorkflow1
    Scenario: Validate Child Workflow Creation
        #verify clicking on discard No should not show the discard change page and side panel should remain as it is
        Given Set user as "childWorkflowUser"
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        When User clicks create new button
        And User searches "ChildWorkflowAutomation" in create new search
        Then user checks for "ChildWorkflow" table
        Then user checks for "Add New Data" button in child workflow
        Then user checks for "No data/findings" text on page should "be" visible
        When user clicks on "Add New Data" button in child table
        Then user checks for child workflow header
        When user clicks on close button
        Then user checks for discard dialogue box
        When user click on "No" in dialogue box
        Then user checks for "Discarding Changes" text on page should "not" visible
        Then user checks for child workflow header

        #verify clicking on discard Yes should not add the child workflow and discard changes page should be visible
        When user clicks on close button
        Then user checks for discard dialogue box
        When user click on "Yes" in dialogue box
        Then user checks for "Discarding Changes" text on page should "be" visible
        Then user checks for "No data/findings" text on page should "be" visible

        #verify parent to child data mapping 
        When User enters "ParentToChild1" in "NamePTCParent" field
        When user clicks on "Add New Data" button in child table
        Then user verify "ParentToChild1" data for parent to child mapping in "NamePTCChild" field 
        When User enters "Workflow1" in "Username" field
        When User enters "mother" in "Mothername" field
        When User enters "23" in "Age" field
        When User enters "abc@getcerta.com" in "Email" field
        When User enters "ChildToParent1" in "NameCTPChild" field
        When User submits child workflow step
        Then user checks for "Step submitted successfully" text on page should "be" visible

        #verify row count after adding data
        Then user checks for table row count should be "1"

        #verify the newly added data row
        Then user verify the newly added workflow "Workflow1"

        #verify child to parent data mapping 
        Then user verify "ChildToParent1" data for child to parent mapping in "NameCTPParent" field 

        #verify the table data with actual workflow data
        When user get the workflow data for workflow with name "Workflow1"
        When user clicks on close button
        When user get the workflow data from table with name "Workflow1"
        Then user verify the the workflow data

        #add more data in child workflow tablw
        When user clicks on "Add New Data" button in child table
        When User enters "Workflow2" in "Username" field
        When User enters "mother2" in "Mothername" field
        When User enters "24" in "Age" field
        When User enters "abc1@getcerta.com" in "Email" field
        When User enters "ChildToParent2" in "NameCTPChild" field
        When User submits child workflow step
        Then user checks for "Step submitted successfully" text on page should "be" visible

        When user clicks on "Add New Data" button in child table
        When User enters "Workflow3" in "Username" field
        When User enters "mother3" in "Mothername" field
        When User enters "25" in "Age" field
        When User enters "abc3@getcerta.com" in "Email" field
        When User enters "ChildToParent4" in "NameCTPChild" field
        When User submits child workflow step
        Then user checks for "Step submitted successfully" text on page should "be" visible

        # # Verify child workflow columns sorting for name 
        When User sorts "Name" column in child workflow table
        Then Verify records in child workflow table sorted by "Name" field
        
        # Verify child workflow columns sorting for age 
        When User sorts "Age" column in child workflow table
        Then Verify records in child workflow table sorted by "Age" field

        #verify the child workflow name column filters 
        When User enters filter in child workflow table and clicks search
            | ColumnName | Value |
            | name  | Workflow1 |
        Then Verify applied filters are working in child workflow table
            | Field | Value | 
            | name  | Workflow1 | 
        When user reset the filter for "Name" column

        #verify the child workflow nameCTP column filters 
        When User enters filter in child workflow table and clicks search
            | ColumnName | Value |
            | nameCTP  | ChildToParent2 |
        Then Verify applied filters are working in child workflow table
            | Field | Value | 
            | nameCTP  | ChildToParent2 | 
        When user reset the filter for "nameCTP" column

        #verify the child workflow search feature for email column
        When User search in child workflow table and clicks search
            | ColumnName | Value |
            | email  | abc1@getcerta.com |
        Then Verify applied filters are working in child workflow table
            | Field | Value | 
            | email  | abc1@getcerta.com | 
        When user reset the filter for "email" column

        #verify the child workflow search feature for mothername column
        When User search in child workflow table and clicks search
            | ColumnName | Value |
            | mothername  | mother3 |
        Then Verify applied filters are working in child workflow table
            | Field | Value | 
            | mothername  | mother3 | 
        When user reset the filter for "mothername" column