import { ok, deepEqual } from 'assert';
import level from 'fit-block-store';
import fitBlock from '../index';
const config = fitBlock.getConfig()
const server = level.getServer();
const testWalletAdress = fitBlock.getWalletAdressByPublicKey(fitBlock.getPublicKeyByPrivateKey(fitBlock.genPrivateKeyByString('123456')));
config.godWalletAdress = testWalletAdress;
config.selfWalletAdress = testWalletAdress;
let godBlock;
const runBefore = {
    [Symbol('before.server')] : async function() {
        await server.listen();
    },
}
const testUnit = {
    [Symbol('test.genGodBlock')] : async function() {
        godBlock = await fitBlock.genGodBlock();
        ok(fitBlock.verifyGodBlock(godBlock),'genGodBlock error!');
    },
    [Symbol('test.keepGodBlockData')] : async function() {
        ok(await fitBlock.keepGodBlockData(godBlock),'keepGodBlockData error!')
    },
    [Symbol('test.getGodBlockHash')] : async function() {
        ok(fitBlock.getGodBlockHash() === fitBlock.getConfig().godBlockHash,'getGodBlockHash error!')
    },
    [Symbol('test.loadGodBlock')] : async function() {
        const loadGodBlock = await fitBlock.loadGodBlock();
        deepEqual(godBlock,loadGodBlock,'loadGodBlock error!')
    },
    [Symbol('test.loadLastBlockData')] : async function() {
        const loadLastBlock = await fitBlock.loadLastBlockData();
        deepEqual(godBlock,loadLastBlock,'loadLastBlockData error!')
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
    [Symbol('test.genTransaction && test.keepTransaction')] : async function() {
        const privateKey = fitBlock.genPrivateKeyByString('123456');
        const accepterPublicKey = fitBlock.getPublicKeyByPrivateKey(
            fitBlock.genPrivateKeyByString('654321')
        )
        const accepterAdress = fitBlock.getWalletAdressByPublicKey(accepterPublicKey);
        const transactionSign = await fitBlock.genTransaction(
            privateKey, accepterAdress, config.initOutBlockCoinNum
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
            transCoinNumber === config.initOutBlockCoinNum,
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
        ok(await fitBlock.keepTransaction(transactionSign),'test.keepTransaction error!')
    },
    [Symbol('test.mining && test.keepBlockData')] : async function() {
        const nextBlock = await fitBlock.mining(godBlock);
        ok(godBlock.verifyNextBlock(nextBlock),'mining error!')
        ok(await fitBlock.keepBlockData(godBlock.nextBlockHash, nextBlock),'keepBlockData error!')
    },
    [Symbol('test.getCoinNumberyByWalletAdress')] : async function() {
        const testAdressCoinNumber = await fitBlock.getCoinNumberyByWalletAdress(testWalletAdress);
        const accepterPublicKey = fitBlock.getPublicKeyByPrivateKey(
            fitBlock.genPrivateKeyByString('654321')
        )
        const accepterAdress = fitBlock.getWalletAdressByPublicKey(accepterPublicKey);
        const accepterAdressCoinNumber  = await fitBlock.getCoinNumberyByWalletAdress(accepterAdress);
        const transactionCoinNumber = Math.ceil(config.initOutBlockCoinNum*config.transactionRate);
        ok(testAdressCoinNumber=== config.initOutBlockCoinNum + transactionCoinNumber
            && accepterAdressCoinNumber=== config.initOutBlockCoinNum - transactionCoinNumber,'getCoinNumberyByWalletAdress error!')
    },
    [Symbol('test.sendTransaction')] : async function() {
        const emptyTransactionList = await fitBlock.sendTransaction();
        ok(emptyTransactionList.length===0,'sendTransaction.notEmpty error!')
        const privateKey = fitBlock.genPrivateKeyByString('123456');
        const accepterPublicKey = fitBlock.getPublicKeyByPrivateKey(
            fitBlock.genPrivateKeyByString('654321')
        )
        const accepterAdress = fitBlock.getWalletAdressByPublicKey(accepterPublicKey);
        const transactionSign = await fitBlock.genTransaction(
            privateKey, accepterAdress, config.initOutBlockCoinNum
        );
        await fitBlock.keepTransaction(transactionSign);
        const transactionList = await fitBlock.sendTransaction();
        ok(transactionList.length===1,'sendTransaction error!')
    },
    [Symbol('test.acceptTransaction')] : async function() {
        const privateKey = fitBlock.genPrivateKeyByString('123456');
        const accepterPublicKey = fitBlock.getPublicKeyByPrivateKey(
            fitBlock.genPrivateKeyByString('654321')
        )
        const accepterAdress = fitBlock.getWalletAdressByPublicKey(accepterPublicKey);
        const newTransactionSign = await fitBlock.genTransaction(
            privateKey, accepterAdress, config.initOutBlockCoinNum
        );
        const passTransactionSign = await fitBlock.acceptTransaction(newTransactionSign);
        ok(passTransactionSign.isSame(newTransactionSign),'acceptTransaction error!');
        try{
            await fitBlock.keepTransaction(newTransactionSign);
            await fitBlock.acceptTransaction(newTransactionSign);
        } catch(err) {
            ok(
                err.message==='transactionSign is already exist',
                'acceptTransaction.checkIsTransactionSignInMap error!'
            )
        }
        const loadLastBlock = await fitBlock.loadLastBlockData();
        try{
            await fitBlock.acceptTransaction(loadLastBlock.transactionSigns[0]);
        } catch(err) {
            ok(
                err.message==='transactionSign is already in block',
                'acceptTransaction.checkIsTransactionSignInBlock  error!'
            )
        }
    },
    [Symbol('test.sendBlockByHash && test.acceptBlock')] : async function() {
        const block = await fitBlock.sendBlockByHash(godBlock.nextBlockHash);
        const verifyBlock = await fitBlock.acceptBlock(fitBlock.getGodBlockHash(), block)
        ok(block.isSame(verifyBlock),'test.sendBlockByHash && test.acceptBlock error!');
    }
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

