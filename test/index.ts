import { ok } from 'assert';
import level from 'fit-block-store';
import fitBlock from '../index';
const server = level.getServer();
const runBefore = {
    [Symbol('before.server')] : async function() {
        await server.listen();
    },
}
const testUnit = {
    [Symbol('test.genGodBlock')] : async function() {
        const godBlock =  await fitBlock.genGodBlock();
        ok(godBlock,'genGodBlock error!');
    },
    [Symbol('test.loadGodBlock')] : async function() {
        const godBlock = await fitBlock.loadGodBlock();
        ok(godBlock.nHardBit === 2,'loadGodBlock nHardBit error!')
        ok(godBlock.workerAddress === fitBlock.getConfig().godWalletAdress,'loadGodBlock workerAddress error!')
        ok(godBlock.height === 0,'loadGodBlock height error!')
        ok(godBlock.transactionSigns.length === 0,'loadGodBlock transactionSigns error!')
        ok(godBlock.blockVal.length === 128,'loadGodBlock blockVal error!')
        ok(godBlock.nextBlockHash.length === 64,'loadGodBlock nextBlockHash error!')
        ok(godBlock.timestamp > 1578000000000,'loadGodBlock timestamp error!')
    },
    [Symbol('test.genPrivateKeyByString')] : async function() {
        const privateKey = fitBlock.genPrivateKeyByString('123456');
        ok(
            privateKey === '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
            'genPrivateKeyByString error!'
        )
    },
    [Symbol('test.genPrivateKeyByRand')] : async function() {
        const privateKey = fitBlock.genPrivateKeyByRand();
        ok(
            privateKey.length === 64,
            'genPrivateKeyByRand error!'
        )
    },
    [Symbol('test.getPublicKeyByPrivateKey')] : async function() {
        const publicKey = fitBlock.getPublicKeyByPrivateKey(fitBlock.genPrivateKeyByString('123456'));
        ok(
            publicKey === '431745adae24044ff09c3541537160abb8d5d720275bbaeed0b3d035b1e8b263'+
            'c3f42d437dc9988eaa686fdd5325eba20f4b73f3062942626060537e1dfe453f8',
            'getPublicKeyByPrivateKey error!'
        )
    },
    [Symbol('test.getWalletAdressByPublicKey')] : async function() {
        const publicKey = fitBlock.getPublicKeyByPrivateKey(fitBlock.genPrivateKeyByString('123456'));
        const walletAdress = fitBlock.getWalletAdressByPublicKey(publicKey);
        ok(
            walletAdress === 'NTnUXweGFyTWSFExaH3iEG3X7Dcxi8Kyesr5GKvBheSYSqu9PdiMfQNPY6xytKMVaMjpnX3HXt9XEfU4XwBwpLSj',
            'getWalletAdressByPublicKey error!'
        )
    },
    [Symbol('test.getPublicKeyByWalletAdress')] : async function() {
        const publicKey = fitBlock.getPublicKeyByWalletAdress(
            'NTnUXweGFyTWSFExaH3iEG3X7Dcxi8Kyesr5GKvBheSYSqu9PdiMfQNPY6xytKMVaMjpnX3HXt9XEfU4XwBwpLSj'
        );
        ok(
            publicKey === '431745adae24044ff09c3541537160abb8d5d720275bbaeed0b3d035b1e8b263'+
            'c3f42d437dc9988eaa686fdd5325eba20f4b73f3062942626060537e1dfe453f8',
            'getPublicKeyByWalletAdress error!'
        )
    },
    [Symbol('test.genTransaction')] : async function() {
        const privateKey = fitBlock.genPrivateKeyByString('123456');
        const accepterPublicKey = fitBlock.getPublicKeyByPrivateKey(
            fitBlock.genPrivateKeyByString('654321')
        )
        const accepterAdress = fitBlock.getWalletAdressByPublicKey(accepterPublicKey);
        const transactionSign = await fitBlock.genTransaction(
            privateKey, accepterAdress, 2
        );
        ok(
            transactionSign.transaction.
            senderAdress === fitBlock.getWalletAdressByPublicKey(fitBlock.getPublicKeyByPrivateKey(privateKey)),
            'genTransaction.transaction.senderAdress error!'
        )
        ok(
            transactionSign.transaction.
            accepterAdress === accepterAdress,
            'genTransaction.transaction.senderAdress error!'
        )
        ok(
            transactionSign.transaction.
            transCoinNumber === 2,
            'genTransaction.transaction.transCoinNumber error!'
        )
        ok(
            transactionSign.transaction.
            timestamp >1578000000000,
            'genTransaction.transaction.timestamp error!'
        )
        ok(
            transactionSign.inBlockHash ==='',
            'genTransaction.transaction.inBlockHash error!'
        )
        ok(
            transactionSign.signString.split(',').length ===2,
            'genTransaction.transaction.signString error!'
        )
    },
}

const runAfter = {
    [Symbol('after.server')] : async function() {
        await server.close();
    },
}

async function run(testUnitList) {
    for(let testUnitValue of testUnitList) {
        for(let testFunc of Object.getOwnPropertySymbols(testUnitValue)) {
            await testUnitValue[testFunc]();
        }
    }
}
(async function() {
    try {
        await run([runBefore]);
        await run([testUnit]);
    } finally {
        await run([runAfter]);
    }
})();

