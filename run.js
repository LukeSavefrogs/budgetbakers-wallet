import wallet from 'wallet-budgetbakers-import';

const walletEmail = process.argv[0];
const walletPassword = process.argv[1];

const importEmail = process.argv[2];

try {
    await wallet.login(walletEmail, walletPassword);
    const result = await wallet.importFile({
        //file: 'path/to/file/2022-03-20T16-20.csv',
        file: '2025-06-18T01-23.csv',
        email: importEmail,
	newRecordsOnly: false,
    });
    console.log(result);
} catch(err) {
    console.error(err);
}
