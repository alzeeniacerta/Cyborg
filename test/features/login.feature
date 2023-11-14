@test
Feature: User Authentication Feature

    Background:
        And User navigates to application url

    @test1
    Scenario: Verify certa associate login
        And User clicks on certa associate
        And Take screenshot
        And User clicks on login using email and password
        And User enters "contact@aman-gupta.in" in username field
        And User enters "Certa@2023" in password field
        And User clicks on login button
    
    @test2
    Scenario: Verify certa associate login
        And User clicks on certa associate
        And User clicks on login using email and password
        And Fail