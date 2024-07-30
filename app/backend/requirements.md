# App requirements

### STEP 1 - Financial planning:

- set incomes distribution

  - the user will need to select a distribution profile separated in essential expenses, non-essential expenses, and investments to start using the application
  - the initial available profiles will be:
    - 50 / 30 / 20 - for people who have a family and already save money and want to start to invest
    - 40 / 30 / 30 - for people who have an stable family or live alone and can save more money
    - 20 / 20 / 60 - for people who live with parents and don't need to help with the expenses
    - 60 / 25 / 15 - for people who have a family with relatively high essential enpenses but already save money and want to start to invest
    - 70 / 20 / 10 - for people who have family with children or need to help the family and is starting to invest

- add outcomes

  - the value must be positive an greater than zero
  - the description must be alphanumeric
  - the date must be in YYYY-MM-DD format and can be before or equal to the current date
  - the category must be an existent value of the distribution categories

- list monthly outcomes by category

- create a report for the last month every first day of the month

- list the total saved money without interests

- compare non-essential expenses between the three last months

### STEP 2 - Invesment control:

- add investment

  - the value must be positive
  - the operation must be SELL or BUY
  - the asset type needs to be COMPANY_SHARE, REAL_ESTATE_FUND or FIXED_INCOME
  - the ticker is required when the asset type is COMPANY_SHARE or REAL_ESTATE_FUND
  - the description is required

- calculate the Average Price of the investments assets

- generate IRPF report with annual transactions