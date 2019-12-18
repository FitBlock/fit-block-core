import CoinWorkerBase from '../../types/CoinWorkerBase';
import Block from './Block';
import config from './config'
export default class CoinWorker extends CoinWorkerBase {
    /**
     * 思来想去多线程不适合在app里面实现，app就保持单进程单线程最妙，复杂度最低
     * keep single process single thread in app please.
     * @param preBlock 
     */
    async mining(preBlock: Block): Promise<Block> {
        const newBlock = new Block(config.selfWalletAdress);
        await this.addTransactionInBlock(newBlock);
        let startBigInt = 0n;
        do {
            startBigInt++;
        } while(!(preBlock.verifyNextBlockVal(newBlock)));
        newBlock.outBlock(preBlock.getBlockValByBigInt(startBigInt));
        return newBlock;
    }
    addTransactionInBlock(newBlock: Block): Promise<Block> {
        throw new Error("Method not implemented.");
    }
    
}