import TransactionSignBase from './TransactionSignBase';

export default abstract class BlockBase {
    timestamp:number;
    transactionSigns:Array<TransactionSignBase>;
    nextBlockHash: string;
    blockVal: string;
    workerAddress: string;
    height:number;
    nHardBit:number = 2;
    constructor (workerAddress, height) {
        this.workerAddress = workerAddress;
        this.height = height;
        this.transactionSigns = [];
    }
    abstract addTransaction(transactionSign: TransactionSignBase): void;

    abstract genBlockHash():string;

    abstract getNextBlockValPowValue(nextBlock:BlockBase):bigint;
    abstract getNextBlockNHardBit(nextBlock:BlockBase):number;

    abstract verifyNextBlockHeight(nextBlock:BlockBase): boolean;
    abstract verifyTransactions(nextBlock:BlockBase): boolean;
    abstract verifyNextBlockVal(nextBlock:BlockBase):boolean;
    abstract verifyNextBlockHash(nextBlock:BlockBase):boolean;
    abstract verifyNextBlockTimestamp(nextBlock:BlockBase):boolean;
    abstract verifyNextBlockNHardBit(nextBlock:BlockBase):boolean;

    abstract verifyNextBlock(nextBlock:BlockBase):boolean;

    abstract verifyGodBlock(godBlock:BlockBase):boolean 

    abstract isSame(block:BlockBase):boolean;

    abstract outBlock(newBlock: BlockBase): BlockBase;

    abstract getCoinNumByWalletAdress(walletAdress: string): number;

    serialize() {
        return JSON.stringify(this);
    }
}