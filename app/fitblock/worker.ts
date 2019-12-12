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
            nextBlockHash =  preBlock.getBlockHashByBlockVal(
                preBlock.getBlockValByBigInt(startBigInt)
            );
        } while(!(this.verifyNextBlockHash(preBlock, nextBlockHash)));
        const newBlock = new Block();
        this.addTransactionInBlock(newBlock);
        newBlock.outBlock(preBlock.getBlockValByBigInt(startBigInt), config.selfWalletAdress);
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