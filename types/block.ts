import {createHash} from 'crypto';
export default class Block {
    timestamp:Number;
    transactions:Array<String>;
    prevBlockHash: string;
    hash: string;
    nNonce: string;
    constructor () {
        this.timestamp = new Date().getTime();
        this.transactions = [];
    }
    
    addTransaction(transaction: string) {
        this.transactions.push(transaction);
    }

    setHash(): string {
        return createHash('SHA256').update(JSON.stringify(this.transactions)).digest('hex');
    }
}