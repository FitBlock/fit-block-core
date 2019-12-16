import TransactionBaseSign from './TransactionSignBase';

export default abstract class BlockBase {
    timestamp:number;
    transactionSigns:Array<TransactionBaseSign>;
    nextBlockHash: string;
    blockVal: string;
    workerAddress: string;
    nHardBit:number = 2;
    constructor (workerAddress) {
        this.workerAddress = workerAddress;
        this.transactionSigns = [];
    }
    abstract addTransaction(transactionSign: TransactionBaseSign): void;

    abstract genBlockHash():string;

    abstract getNextBlockNHardBit(nextBlock:BlockBase):number;

    abstract verifyTransactions(nextBlock:BlockBase): boolean;
    abstract verifyNextBlockVal(nextBlock:BlockBase):boolean;
    abstract verifyNextBlockHash(nextBlock:BlockBase):boolean;
    abstract verifyNextBlockTimestamp(nextBlock:BlockBase):boolean;
    abstract verifyNextBlockNHardBit(nextBlock:BlockBase):boolean;

    abstract verifyNextBlock(nextBlock:BlockBase):boolean;

    abstract outBlock(nextBlockVal: string, walletAdress: string): void;
}