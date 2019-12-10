import TransactionBaseSign from './TransactionSignBase';

export default abstract class BlockBase {
    timestamp:Number;
    transactions:Array<TransactionBaseSign>;
    nextBlockHash: string;
    workerAddress: string;
    constructor () {
        this.transactions = [];
    }
    abstract addTransaction(transactionSign: TransactionBaseSign): void;

    abstract outBlock(nextBlockHash: string, walletAdress: string): void;
}