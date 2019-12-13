import TransactionBase from '../../types/TransactionBase';
import config from './config'
export default class Transaction extends TransactionBase {
    constructor(senderAdress:string,accepterAdress:string,transCoinNumber:number) {
        transCoinNumber = Math.floor(transCoinNumber);
        if(transCoinNumber<2){throw new Error('trans coin number must gte 2!')}
        super(senderAdress,accepterAdress,transCoinNumber);
    }
    getTradingFees():number {
        return Math.ceil(this.transCoinNumber*config.transactionRate);
    }
}