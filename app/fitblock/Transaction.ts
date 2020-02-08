import TransactionBase from '../../types/TransactionBase';
import config from './config'
export default class Transaction extends TransactionBase {
    constructor(senderAdress:string,accepterAdress:string,transCoinNumber:number) {
        transCoinNumber = Math.floor(transCoinNumber);
        if(transCoinNumber<2){throw new Error('trans coin number must gte 2!')}
        super(senderAdress,accepterAdress,transCoinNumber);
    }
    getArriveFees():number {
        return this.transCoinNumber-this.getTradingFees();
    }

    isTimeOut():boolean {
        return this.timestamp < (new Date().getTime()-config.transactionTimeOutTime)
    }

    getTradingFees():number {
        return Math.ceil(this.transCoinNumber*config.transactionRate);
    }
    isSame(transaction:Transaction):boolean {
        return this.serialize()===transaction.serialize()
    }
    static createByData(transactionData: any): Transaction {
        const newTransaction = new Transaction(
            transactionData.senderAdress,
            transactionData.accepterAdress,
            transactionData.transCoinNumber,
        )
        Object.assign(newTransaction, transactionData);
        return newTransaction
    }
}