import CoinWorkerBase from '../../types/CoinWorkerBase';
import Block from './Block';
import config from './config'
import {sleep} from './util/index'
import {getStoreInstance} from './Store'
import Store from './Store'
export default class CoinWorker extends CoinWorkerBase {
    myStore:Store;
    constructor(dbClient:any) {
        super();
        this.myStore = getStoreInstance(dbClient);
    }
    async mining(preBlock:Block, miningAddress:string='', range: Array<bigint> = [0n,-1n]): Promise<Block> {
        // range default (0,-1n]
        const newBlock = new Block(miningAddress, preBlock.height+1);
        if(range[0]<0n){
            throw new Error('range must gte 0');
        }
        let startBigInt = range[0];
        let nextBlockHash = preBlock.nextBlockHash;
        let PowValueMax = 0n;
        let PowValueMaxBlockVal;
        await this.addTransactionInBlock(nextBlockHash, newBlock);
        do {
            await sleep(10) // 这里是为了尽可能不影响其他异步任务，为异步任务分片
            startBigInt++;
            newBlock.blockVal = startBigInt.toString(config.blockValRadix);
            // feture support pool
            const newPowValue  = preBlock.getNextBlockValPowValue(newBlock);
            if(newPowValue>PowValueMax) {
                PowValueMax = newPowValue;
                PowValueMaxBlockVal = newBlock.blockVal;
            }
            if(range[1]>0n && startBigInt>range[1]){break;}
        } while(!(preBlock.verifyNextBlockVal(newBlock)));
        if(PowValueMaxBlockVal) {newBlock.blockVal = PowValueMaxBlockVal;}
        return preBlock.outBlock(newBlock);
    }
    async addTransactionInBlock(nextBlockHash:string ,newBlock: Block): Promise<Block> {
        for await (const transactionSign of await this.myStore.transactionSignIterator()) {
            if(!transactionSign.isTimeOut()) {
                transactionSign.inBlockHash = nextBlockHash;
                newBlock.transactionSigns.push(transactionSign)
            }
        }
        return newBlock;
    }
    
}