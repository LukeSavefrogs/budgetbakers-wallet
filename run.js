#!/usr/bin/env node
import wallet from 'wallet-budgetbakers-import';

import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import moment from 'moment';

import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";

import { fileURLToPath } from 'url';
// Use `import.meta.url` instead of `__dirname` or `import.meta.dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Validate required options
if (options.file) {
    if (!fs.existsSync(options.file)) {
        console.error(`File "${options.file}" does not exist.`);
        process.exit(1);
    } else if (options.currency || options.amount || options.date || options.time) {
        console.error('If a file is specified, no other options should be provided.');
        process.exit(1);
    }
} else if (!options.file && (!options.currency || !options.amount || !options.date || !options.time)) {
    console.error('If no file is specified, at least --currency, --amount, --date, and --time are required.');
    process.exit(1);
}

const walletEmail = options.username;
const walletPassword = options.password;

const importEmail = options.importEmail;

let importedFilename = options.file;
const tempDir = fs.mkdtempSync(new Date().toISOString() + '-');

try {
    // Create file from provided data if no file is specified
	if (!options.file) {
		console.log("Record date: " + moment(options.date + " " + options.time, "DD-MM-YY HH:mm").toDate().toISOString())
		let currentDatetime = new Date().toISOString().replace('T', ' ').substring(0, 16).replace(" ", "T").replace(":", "-");

		console.log('Current Datetime is ' + currentDatetime)
		importedFilename = path.join(tempDir, currentDatetime + '.csv')

        const header = parse(
            fs.readFileSync(path.join(__dirname, 'example.csv')).toString(),
            {
                skip_empty_lines: true,
                bom: true,
                trim: true,
            }
        );
        const output = stringify([
            header[0],
            [
                moment(options.date + " " + options.time, "DD-MM-YY HH:mm").toDate().toISOString(),
                options.note,
                '0',
                options.amount.replace(".", "").replace(",", "."),
                options.currency,
                options.recipient,
            ]
        ]);

		fs.writeFileSync(importedFilename, output)
	}

    console.log('Processing file "' + importedFilename + '"');
    console.log('File contents: \n' + fs.readFileSync(importedFilename).toString().split('\n').map(line => '  | ' + line).join('\n'));

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
