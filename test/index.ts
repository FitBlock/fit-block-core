import {ok,equal,deepStrictEqual, strictEqual} from 'assert';
import fitBlock from '../index'
let testUnit = {
    [Symbol('test.genGodBlock')] : async function() {
        await fitBlock.genGodBlock();
    },
    [Symbol('test.loadGodBlock')] : async function() {
        const godBlock = await fitBlock.loadGodBlock();
    },
}

async function run(testUnitList) {
    for(let testUnitValue of testUnitList) {
        for(let testFunc of Object.getOwnPropertySymbols(testUnitValue)) {
            await testUnitValue[testFunc]();
        }
    }
}
run([testUnit]);