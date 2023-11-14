@dashboard
Feature: Dashboard feature

    This feature tests scenarios at dashboard tab

    @dashboard1
    Scenario: Report verification
        Given Set user as "Dashboard2"
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        Then Verify create new is displayed
        When User clicks on dashboard button
        Then Verify dashboard page is displayed

        # Report wishlist
        When User selects "Home" dashboard
        Then Verify 0 report are displayed on dashboard
        When User selects "Automation_Sanity" dashboard
        And User "add" report 1 to wishlist
        And User selects "Home" dashboard
        Then Verify 1 report are displayed on dashboard
        When User selects "Automation_Sanity" dashboard
        And User "remove" report 1 to wishlist
        And User selects "Home" dashboard
        Then Verify 0 report are displayed on dashboard

        # Jump to report
        When User selects "Automation_Sanity" dashboard
        And User jumps to "TESTARC completed Report" report
        Then Verify report name is "TESTARC completed Report"

        # Arrangement verification
        When User clicks back button
        And User selects "Automation_Sanity" dashboard
        And User clicks on dashboard options
        And User clicks "Change Arrangements" option
        And User drags report from position 1 to 2
        Then Verify report is dragged from position 1 to 2
        And User clicks done on dashboard page
        Then Save report data for report 1

        # Exporting to CSV verification
        And User clicks menu options for report 1
        And User clicks "Export to CSV" from report options
        Then Get link from email with subject "Report CSV Export"
        And User downloads "csv_report.csv" file from link
        Then Verify process name from exported file "csv_report.csv"

        # Expanded view verification
        And User clicks "expand" button for report 1
        Then Verify expanded report is displayed

        # Verify report columns
        When User sorts "Name" field
        Then Verify records are sorted by "Name" field
        When User enters filter and clicks search
            | Field | Value |
            | name  | draft |
        Then Verify filters are applied
            | Field | Value | Result expected | Verify filter Tags |
            | name  | draft | true            | true               |
        And User clicks back button

        # Create report
        When User clicks add report button
        And User names report as "Automation_Report"
        And User sets report basic filters
            | Field        | Value       |
            | process type | testarc     |
            | status       | In Progress |
        And User clicks save report button
        And User clicks "expand" button for report 3
        Then Verify filters are applied
            | Field  | Value       | Result expected | Verify filter Tags |
            | status | In Progress | true            | false              |
        Then Verify report name is "Automation_Report"

        # Edit report
        When User clicks menu options for report 1
        And User clicks "Edit report" from report options
        And User names report as "Automation_Report_Updated"
        And User sets report basic filters
            | Field    | Value |
            | contains | test  |
        And User clicks save report button
        And User clicks "expand" button for report 3
        Then Verify report name is "Automation_Report_Updated"
        Then Verify filters are applied
            | Field | Value | Result expected | Verify filter Tags |
            | name  | test  | true            | false              |
        When User clicks back button
        And User clicks menu options for report 3
        And User clicks "Delete" from report options
        Then Verify report "Automation_Report_Updated" is deleted

        # Report Comment
        And User clicks "comment" button for report 1
        And User mentions "Dashboard User1" on "report" comment
        Then Verify content in email sent to "dashboard_user1@lvmelelj.mailosaur.net" with subject "You have been tagged in a comment!"
            | Text to verify                         |
            | dashboard_user2@lvmelelj.mailosaur.net |
            | @Dashboard User1                       |

        # Report activity log
        When User clicks "expand" button for report 1
        And User clicks menu options for report 1
        And User clicks "Activity Log" from report options
        Then Verify logs are displayed for dashboard report
            | logType | logDescription                                                        | timestamp         | Index |
            | views   | dashboard_user2@lvmelelj.mailosaur.net viewed Core of Report Workflow | a few seconds ago | 1     |
            | emails  | Report CSV Export                                                     | a few seconds ago | 1     |

    @dashboard2
    Scenario: Dashboard verification
        Given Set user as "Dashboard"
        When User clicks on certa associate
        And User clicks on login using email and password
        And User enters username in username field
        And User enters password in password field
        And User clicks on login button
        Then Verify create new is displayed
        When User clicks on dashboard button
        Then Verify dashboard page is displayed

        # Creating new dashboard
        When User clicks on create new dashboard button
        And User enters "Automation_Sanity_New_Dashboard" in dashboard name field
        And User clicks create dashboard button
        Then Verify dashboard name "Automation_Sanity_New_Dashboard"

        # Edit & rename dashboard
        When User clicks on dashboard options
        And User clicks "Edit dashboard" option
        And User enters "Automation_Sanity_New_Dashboard_Updated" in dashboard name field
        And User clicks update dashboard button
        Then Verify dashboard name "Automation_Sanity_New_Dashboard_Updated"

        # Delete dashboard
        When User clicks on dashboard options
        And User clicks "Delete" option
        Then Verify "Automation_Sanity_New_Dashboard_Updated" dashboard is deleted

        # Jump to dashboard
        When User jumps to "Automation_Sanity_2" dashboard
        Then Verify dashboard name "Automation_Sanity_2"

        # Download dashboard PDF
        When User clicks on dashboard options
        And User downloads dashboard in "PDF" format
        Then Verify contents of dashboard "PDF" file
            | Text to verify        |
            | TESTARC Scatter Chart |
            | TESTARC Pie Chart     |

        # Download dashboard PNG
        When User clicks on dashboard options
        And User downloads dashboard in "PNG" format
        And User extracts dashboard file
        Then Verify files are extracted in downloads folder
            | File name             |
            | TESTARC Scatter Chart |
            | TESTARC Pie Chart     |

        # Download dashboard PPT
        When User clicks on dashboard options
        And User downloads dashboard in "PPT" format
        Then Verify contents of dashboard "PPT" file
            | Text to verify        |
            | TESTARC Scatter Chart |
            | TESTARC Pie Chart     |

        # Create & verify Subscription
        When User jumps to "Automation_Sanity" dashboard
        Then Verify dashboard name "Automation_Sanity"
        And Save report data for report 1
        When User clicks menu options for report 1
        And User clicks "Manage subscriptions" from report options
        And User clicks on create subscription button
        And User selects "Email subscription" as subscription type
        And User enters "Automation_sanity_subscription" in subscription name
        And User enters email in select users field for subscription
        And User enters time for subscription
        And User clicks subscribe button
        And Wait for 60 seconds
        Then Get link from email with subject "Report CSV Export"
        And User downloads "csv_report.csv" file from link
        Then Verify process name from exported file "csv_report.csv"

        # Delete subscription
        When User deletes subscription
        And User clicks on ok button
