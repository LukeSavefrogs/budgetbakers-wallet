#!/usr/bin/env node
import wallet from 'wallet-budgetbakers-import';

import { program } from 'commander';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import moment from 'moment';

program
  .name('BudgetBakers\' automatic import')
  .description('Import all the provided expenses data into your Wallet account')
  .requiredOption('-u, --username <username>')
  .option('-p, --password <password>')
  .requiredOption('-e, --import-email <email>')
  .option('-f, --file <file>')
  .option('--currency <currency>', 'EUR')
  .option('--amount <amount>')
  .option('--date <date>')
  .option('--time <time>')
  .option('--note <note>', '')
  .option('--recipient <recipient>', '');

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;

const walletEmail = options.username;
const walletPassword = options.password;

const importEmail = options.importEmail;

let importedFilename = options.file;
const tempDir = fs.mkdtempSync(new Date().toISOString() + '-');

try {
	if (!options.file) {
		console.log("Recprd date: " + moment(options.date + " " + options.time, "DD-MM-YY HH:mm").toDate().toISOString())
		let currentDatetime = new Date().toISOString().replace('T', ' ').substring(0, 16).replace(" ", "T").replace(":", "-");

		console.log('Current Datetime is ' + currentDatetime)
		importedFilename = path.join(tempDir, currentDatetime + '.csv')
		fs.writeFileSync(
			importedFilename, 
			fs.readFileSync(path.join(import.meta.dirname, 'example.csv')).toString().split('\n')[0] 
			+ "\n" + moment(options.date + " " + options.time, "DD-MM-YY HH:mm").toDate().toISOString() + "," + options.note + ",0," + options.amount.replace(",", ".") + "," + options.currency + "," + options.recipient
		)
	}
    console.log('Processing file "' + importedFilename + '"');
    console.log('File contents: ' + fs.readFileSync(importedFilename));
    await wallet.login(walletEmail, walletPassword);
    const result = await wallet.importFile({
        file: importedFilename,
        email: importEmail,
	newRecordsOnly: false,
    });
    console.log(result);
} catch(err) {
    console.error(err);
} finally {
	fs.rmSync(tempDir, { recursive: true, force: true });
}
