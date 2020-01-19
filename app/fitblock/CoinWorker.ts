import CoinWorkerBase from '../../types/CoinWorkerBase';
import Block from './Block';
import config from './config'
import {sleep} from './util/index'
import {getStoreInstance} from './Store'
const myStore = getStoreInstance();
export default class CoinWorker extends CoinWorkerBase {
    async mining(preBlock:Block, range: Array<bigint> = [0n,-1n]): Promise<Block> {
        const newBlock = new Block(config.selfWalletAdress, preBlock.height+1);
        if(range[0]<0n){
            throw new Error('range must gte 0');
        }
        let startBigInt = range[0];
        let nextBlockHash = preBlock.nextBlockHash;
        await this.addTransactionInBlock(nextBlockHash, newBlock);
        do {
            await sleep(10) // 这里是为了尽可能不影响其他异步任务，为异步任务分片
            startBigInt++;
            newBlock.blockVal = startBigInt.toString(config.blockValRadix);
            // feture support pool
            if(range[1]>0n && startBigInt>range[1]){break;}
        } while(!(preBlock.verifyNextBlockVal(newBlock)));
        return preBlock.outBlock(newBlock);
    }
    async addTransactionInBlock(nextBlockHash:string ,newBlock: Block): Promise<Block> {
        for await (const transactionSign of await myStore.transactionSignIterator()) {
            transactionSign.inBlockHash = nextBlockHash;
            newBlock.transactionSigns.push(transactionSign)
        }
        return newBlock;
    }
    
}