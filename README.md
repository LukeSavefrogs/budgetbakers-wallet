# BudgetBakers' Wallet automation

## Usage

1. Install Node and NPM
2. Install dependencies:
  ```shell
  npm install
  ```
3. Create a new csv file following the template:
  ```shell
  cp example.csv YYYY-MM-DDTHH-mm.csv
  ```
4. Run `run.js`:
  ```shell
  node run.js --username WALLET_USERNAME --password WALLET_PASSWORD --import-email IMPORT_ID@imports.budgetbakers.com --file YYYY-MM-DDTHH-mm.csv
  ```

