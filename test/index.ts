import {ok,equal,deepStrictEqual, strictEqual} from 'assert';
import fitBlock from '../index'
import level from 'fit-block-store'
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

