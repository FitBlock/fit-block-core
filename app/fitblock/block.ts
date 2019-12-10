import BlockBase from '../../types/BlockBase';
import TransactionSign from './transactionSign';
export default class Block extends BlockBase {
    constructor () {
        super();
    }
    
    addTransaction(transactionSign: TransactionSign) {
        this.transactions.push(transactionSign);
    }
    outBlock(nextBlockHash: string, walletAdress: string): void {
        this.nextBlockHash = nextBlockHash;
        this.workerAddress = walletAdress;
        this.timestamp = new Date().getTime();
    }
}