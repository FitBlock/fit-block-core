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
        this.nextBlockHash = createHash('sha256').update(nextBlockVal).digest('hex');
        this.workerAddress = walletAdress;
        this.timestamp = new Date().getTime();
    }

    verifyTransaction(transactionSign: TransactionSign): boolean {
        throw new Error("Method not implemented.");
    }
}