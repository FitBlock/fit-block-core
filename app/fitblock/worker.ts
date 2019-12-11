import WorkerBase from '../../types/WorkerBase';
import {createHash} from 'crypto';
import Block from './Block';
import config from './config'
export default class Worker extends WorkerBase {
    mining(preBlock: Block): Block {
        let startBigInt = 0n;
        let nextBlockHash;
        do {
            startBigInt++;
            nextBlockHash =  createHash('sha256').update(startBigInt.toString()).digest('hex');
        } while(!(this.verifyNextBlockHash(preBlock, nextBlockHash)));
        const newBlock = new Block();
        this.addTransactionInBlock(newBlock);
        newBlock.outBlock(startBigInt.toString(), config.selfWalletAdress);
        return newBlock;
    }

    verifyNextBlockHash(preBlock:Block, nextBlockHash:string):boolean {
        const originVerify = preBlock.nextBlockHash.substr(-1, preBlock.nHardBit);
        const nextVerify = nextBlockHash.substr(0, preBlock.nHardBit);
        if(originVerify==nextVerify) {
            return true;
        }
        return false;
    }

    addTransactionInBlock(newBlock: Block): Block {
        throw new Error("Method not implemented.");
    }
    
}