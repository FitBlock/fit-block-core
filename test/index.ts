import {ok,equal,deepStrictEqual, strictEqual} from 'assert';
import fitBlock from '../index'
let testUnit = {
    [Symbol('test.initFitBlock')] : async function() {
        
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