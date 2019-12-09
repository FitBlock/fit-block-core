import TransactionSignBase from '../../types/TransactionSignBase';
import Transaction from './Transaction';
export default class TransactionSign extends TransactionSignBase {
    constructor(transaction:Transaction,signData:string) {
        super(transaction,signData);
    }
}