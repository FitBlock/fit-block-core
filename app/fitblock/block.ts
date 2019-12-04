import BlockBase from '../../types/BlockBase';
export default class Block extends BlockBase {
    timestamp:Number;
    transactions:Array<String>;
    nextBlockHash: string;
    workerAddress: string;
    constructor () {
        super();
    }
    
    addTransaction(transaction: string) {
        this.transactions.push(transaction);
    }

    setNextBlockHash(hash: string): void {
        this.nextBlockHash = hash;
        this.timestamp = new Date().getTime();
    }
}