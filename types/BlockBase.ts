import TransactionBaseSign from './TransactionSignBase';

export default abstract class BlockBase {
    timestamp:number;
    transactions:Array<TransactionBaseSign>;
    nextBlockHash: string;
    nextBlockVal: string;
    workerAddress: string;
    nHardBit:number = 2;
    constructor () {
        this.transactions = [];
    }
    abstract addTransaction(transactionSign: TransactionBaseSign): void;

    abstract getBlockHashByBlockVal(nextBlockVal: string):string;
    
    abstract verifyTransaction(transactionSign: TransactionBaseSign): boolean;

    abstract outBlock(nextBlockVal: string, walletAdress: string): void;
}