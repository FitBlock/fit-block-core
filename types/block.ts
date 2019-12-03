import {createHash} from 'crypto';
export default class Block {
    timestamp:Number;
    transactions:Array<String>;
    prevBlockHash:String;
    hash:String;
    nNonce:String;
    constructor () {
        this.timestamp = new Date().getTime();
        this.transactions = [];
    }
    
    addTransaction(transaction:String) {
        this.transactions.push(transaction);
    }

    setHash(): String {
        return createHash('SHA256').update(JSON.stringify(this.transactions)).digest('hex');
    }
}