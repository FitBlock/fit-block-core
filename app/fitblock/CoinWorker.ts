import CoinWorkerBase from '../../types/CoinWorkerBase';
import Block from './Block';
import config from './config'
import {getStoreInstance} from './Store'
const myStore = getStoreInstance();
export default class CoinWorker extends CoinWorkerBase {
    async mining(): Promise<Block> {
        let preBlock = await myStore.getLastBlockData();
        const newBlock = new Block(config.selfWalletAdress, preBlock.height+1);
        let startBigInt = 0n;
        let nextBlockHash = preBlock.nextBlockHash;
        do {
            preBlock = await myStore.getLastBlockData();
            if(nextBlockHash!==preBlock.nextBlockHash) {
                startBigInt = 0n;
                nextBlockHash = preBlock.nextBlockHash;
            }
            newBlock.transactionSigns = [];
            await this.addTransactionInBlock(nextBlockHash, newBlock);
            startBigInt++;
        } while(!(preBlock.verifyNextBlockVal(newBlock)));
        newBlock.outBlock(preBlock.getBlockValByBigInt(startBigInt));
        return newBlock;
    }
    async addTransactionInBlock(nextBlockHash:string ,newBlock: Block): Promise<Block> {
        for await (const transactionSign of await myStore.transactionSignIterator()) {
            transactionSign.inBlockHash = nextBlockHash;
            newBlock.transactionSigns.push(transactionSign)
        }
        return newBlock;
    }
    
}