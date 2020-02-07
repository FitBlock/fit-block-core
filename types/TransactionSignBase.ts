import TransactionBase from './TransactionBase';
export default abstract class TransactionSignBase {
    transaction:TransactionBase;
    signString:string;
    inBlockHash:string;
    constructor(transaction:TransactionBase) {
        this.transaction = transaction;
        this.inBlockHash = '';
    }
    abstract sign(privateKey: string):string;
    abstract isTimeOut():boolean;
    abstract isSame(transactionSign:TransactionSignBase):boolean;
    abstract verify():boolean;
    serialize() {
        return JSON.stringify(this);
    }
}