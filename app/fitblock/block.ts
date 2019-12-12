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
        this.nextBlockVal = nextBlockVal;
        this.nextBlockHash = this.getBlockHashByBlockVal(nextBlockVal);
        this.workerAddress = walletAdress;
        this.timestamp = new Date().getTime();
    }

    getBlockValByBigInt(blockOriginVal: bigint) {
        return blockOriginVal.toString(16);
    }

    getBlockHashByBlockVal(nextBlockVal: string):string {
        return createHash('sha256').update(nextBlockVal).digest('hex');
    }

    verifyTransaction(transactionSign: TransactionSign): boolean {
        throw new Error("Method not implemented.");
    }
}