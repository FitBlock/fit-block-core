import MiningWorkerBase from '../../types/MiningWorkerBase';
import Block from './Block';
import {join} from 'path';
import config from './config'
const {Worker} = require('worker_threads');
export default class MiningWorker extends MiningWorkerBase {
    mining(preBlock: Block): Promise<Block> {
        const newBlock = new Block(config.selfWalletAdress);
        this.addTransactionInBlock(newBlock);
        return new Promise((resolve, reject)=>{
            const newWorker = new Worker(join(__dirname,'util','new-worker'));
            newWorker.postMessage({preBlock, newBlock});
            newWorker.on('error', (err)=>{
                newWorker.terminate();
                return reject(err);
            });
            newWorker.on('message', (startBigInt) =>{
                newBlock.outBlock(preBlock.getBlockValByBigInt(startBigInt));
                newWorker.terminate();
                return resolve(newBlock);
            });
        });
    }
    addTransactionInBlock(newBlock: Block): Promise<Block> {
        throw new Error("Method not implemented.");
    }
    
}