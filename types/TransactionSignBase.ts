import TransactionBase from './TransactionBase';
export default abstract class TransactionSignBase {
    transaction:TransactionBase;
    signString:string;
    isInBlock:boolean;
    constructor(transaction:TransactionBase) {
        this.transaction = transaction;
        this.isInBlock = false;
    }
    abstract sign(privateKey: string):string;
    abstract verify():boolean;
}