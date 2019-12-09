import TransactionBase from './TransactionBase';
export default abstract class TransactionSignBase {
    transaction:TransactionBase;
    signData:string;
    isInBlock:boolean;
    constructor(transaction:TransactionBase,signData:string) {
        this.transaction = transaction;
        this.signData = signData;
        this.isInBlock = false;
    }
}