import wallet from 'wallet-budgetbakers-import';

const importEmail = 'zxkbyc@imports.budgetbakers.com';
try {
    await wallet.login('lucasalvarani99@gmail.com', 'GtiL5@tvkUHeMz3');
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
