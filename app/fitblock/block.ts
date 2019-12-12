import BlockBase from '../../types/BlockBase';
import TransactionSign from './transactionSign';
import {createHash} from 'crypto';
import config from './config'
export default class Block extends BlockBase {
    nHardBit:number = config.minHardBit;
    constructor () {
        super();
    }
    
    addTransaction(transactionSign: TransactionSign) {
        this.transactions.push(transactionSign);
    }

    outBlock(nextBlockVal: string, walletAdress: string): void {
        this.blockVal = nextBlockVal;
        this.nextBlockHash = this.genBlockHash();
        this.workerAddress = walletAdress;
        this.timestamp = new Date().getTime();
    }

    getBlockValByBigInt(blockOriginVal: bigint) {
        return blockOriginVal.toString(16);
    }

    genBlockHash():string {
        return createHash('sha256').update(`${JSON.stringify(this.transactions)}|${this.BlockVal}`).digest('hex');
    }

    verifyNextBlock(nextBlock:Block):boolean {
        const nextBlockHash = nextBlock.genBlockHash();
        const originVerify = this.nextBlockHash.substr(-1, this.nHardBit);
        const nextVerify = nextBlockHash.substr(0, this.nHardBit);
        if(originVerify!=nextVerify) {return false;}
        for(const transaction of nextBlock.transactions) {
            if(!this.verifyTransaction(transaction)){return false;}
        }
        if(nextBlock.nextBlockHash) {
            if(nextBlock.nextBlockHash!=nextBlockHash){return false;}
        } else {
            nextBlock.nextBlockHash = nextBlockHash;
        }
        return true;
    }
    verifyTransaction(transactionSign: TransactionSign): boolean {
        throw new Error("Method not implemented.");
    }
}