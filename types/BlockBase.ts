import TransactionBaseSign from './TransactionSignBase';

export default abstract class BlockBase {
    timestamp:Number;
    transactions:Array<TransactionBaseSign>;
    nextBlockHash: string;
    workerAddress: string;
    nHardBit:Number = 2;
    constructor () {
        this.transactions = [];
    }
    abstract addTransaction(transactionSign: TransactionBaseSign): void;
    
    abstract verifyTransaction(transactionSign: TransactionBaseSign): boolean;

    abstract outBlock(nextBlockHash: string, walletAdress: string): void;
}