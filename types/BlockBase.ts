import TransactionBaseSign from './TransactionSignBase';

export default abstract class BlockBase {
    timestamp:number;
    transactions:Array<TransactionBaseSign>;
    nextBlockHash: string;
    blockVal: string;
    workerAddress: string;
    nHardBit:number = 2;
    constructor () {
        this.transactions = [];
    }
    abstract addTransaction(transactionSign: TransactionBaseSign): void;

    abstract genBlockHash():string;

    abstract verifyNextBlock(nextBlock:BlockBase):boolean;
    
    abstract verifyTransaction(transactionSign: TransactionBaseSign): boolean;

    abstract outBlock(nextBlockVal: string, walletAdress: string): void;
}