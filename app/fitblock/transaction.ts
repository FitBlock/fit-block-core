import TransactionBase from '../../types/TransactionBase';
export default class Transaction extends TransactionBase {
    constructor(senderAdress:string,accepterAdress:string,transCoinNumber:Number) {
        super(senderAdress,accepterAdress,transCoinNumber);
    }
}