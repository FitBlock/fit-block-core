import Block from '../Block';
const {parentPort} = require('worker_threads');
function mining(preBlock:Block, newBlock:Block) {
    let startBigInt = 0n;
    do {
        startBigInt++;
    } while(!(preBlock.verifyNextBlockVal(newBlock)));
    return startBigInt;
}

parentPort.on('message', (data) => {
    const startBigInt =  mining(data.preBlock, data.newBlock);
    parentPort.postMessage(startBigInt);
})