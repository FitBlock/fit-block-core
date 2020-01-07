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
        ok(await fitBlock.genGodBlock(),'genGodBlock error!');
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
        console.log(publicKey)
        // ok(
        //     publicKey === 64,
        //     'getPublicKeyByPrivateKey error!'
        // )
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

