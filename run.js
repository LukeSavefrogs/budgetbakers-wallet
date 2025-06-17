import wallet from 'wallet-budgetbakers-import';

import { program } from 'commander';

program
  .name('BudgetBakers\' automatic import')
  .description('Import all the provided expenses data into your Wallet account')
  .requiredOption('-u, --username <username>')
  .option('-p, --password <password>')
  .requiredOption('-e, --import-email <email>')
  .option('-f, --file <file>');

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;

const walletEmail = options.username;
const walletPassword = options.password;

const importEmail = options.importEmail;

try {
    await wallet.login(walletEmail, walletPassword);
    const result = await wallet.importFile({
        file: options.file,
        email: importEmail,
	newRecordsOnly: false,
    });
    console.log(result);
} catch(err) {
    console.error(err);
}
