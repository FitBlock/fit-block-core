import CoinWorkerBase from '../../types/CoinWorkerBase';
import Block from './Block';
import config from './config';
import Store, { getStoreInstance } from './Store';
import TransactionSign from './TransactionSign';
import { sleep } from './util/index';
export default class CoinWorker extends CoinWorkerBase {
    myStore:Store;
    constructor(dbClient:any) {
        super();
        this.myStore = getStoreInstance(dbClient);
    }
    async mining(
        preBlock:Block, miningAddress:string='', 
        transactionSignList:Array<TransactionSign>,
        miningAop:(nextBlock: Block)=>Promise<boolean> = async ()=>{return true},
        startBigInt:bigint=0n
        ): Promise<Block> {
        const newBlock = new Block(miningAddress, preBlock.height+1);
        let nextBlockHash = preBlock.nextBlockHash;
        await this.addTransactionInBlock(
            transactionSignList,nextBlockHash, newBlock
        );
        do {
            await sleep(10) // 这里是为了尽可能不影响其他异步任务，为异步任务分片
            startBigInt++;
            newBlock.blockVal = startBigInt.toString(config.blockValRadix);
            if(!(await miningAop(newBlock))){break;}
        } while(!(preBlock.verifyNextBlockVal(newBlock)));
        return preBlock.outBlock(newBlock);
    }
    async addTransactionInBlock(
        transactionSignList:Array<TransactionSign>,
        nextBlockHash:string ,
        newBlock: Block
    ): Promise<Block> {
        for await (const transactionSign of transactionSignList) {
            if(!transactionSign.isTimeOut()) {
                transactionSign.inBlockHash = nextBlockHash;
                newBlock.transactionSigns.push(transactionSign)
            }
        }
        return newBlock;
    }
    
}