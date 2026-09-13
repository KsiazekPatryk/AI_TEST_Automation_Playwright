# Page Knowledge: Authors Page

## Overview
- **URL Path:** `/authors`
- **Purpose:** Manages authors database, adding new authors, listing registered authors.

## DOM Structure & Key Locators

| Component | Semantic Locator Strategy | Notes / Quirks |
| :--- | :--- | :--- |
| **Add Author Button** | `page.getByRole('button', { name: /dodaj autora/i })` | Opens add author form |
| **Author Card / Row** | `page.locator('.author-card')` | Displays first name and last name |
| **Delete Author** | `authorCard.getByRole('button', { name: /usuń/i })` | Triggers author deletion |

## Form Fields (Add Author Modal)

| Field | Locator | Validation / Rules |
| :--- | :--- | :--- |
| **First Name** | `getByLabel(/imię/i)` or `getByPlaceholder(/imię/i)` | Required string |
| **Last Name** | `getByLabel(/nazwisko/i)` or `getByPlaceholder(/nazwisko/i)` | Required string |
| **Submit Button** | `getByRole('button', { name: /dodaj|zapisz/i })` | Submits author creation |
