import WorkerBase from '../../types/WorkerBase';
import Block from './Block';
import config from './config'
export default class Worker extends WorkerBase {
    mining(preBlock: Block): Block {
        const newBlock = new Block(config.selfWalletAdress);
        this.addTransactionInBlock(newBlock);
        let startBigInt = 0n;
        do {
            startBigInt++;
        } while(!(preBlock.verifyNextBlockVal(newBlock)));
        newBlock.outBlock(preBlock.getBlockValByBigInt(startBigInt));
        return newBlock;
    }
    addTransactionInBlock(newBlock: Block): Block {
        throw new Error("Method not implemented.");
    }
    
}