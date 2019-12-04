export default abstract class BlockBase {
    timestamp:Number;
    transactions:Array<String>;
    nextBlockHash: string;
    workerAddress: string;
    constructor () {
        this.transactions = [];
    }
    abstract addTransaction(transaction: string): void;

    abstract setNextBlockHash(hash: string): void;
}