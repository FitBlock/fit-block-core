import TransactionSignBase from '../../types/TransactionSignBase';
import Transaction from './Transaction';
import {base582Hex} from './util/base58';
import ecdsa from 'ecdsa-secp256k1';
import {createHash} from 'crypto';
export default class TransactionSign extends TransactionSignBase {
    constructor(transaction:Transaction) {
        super(transaction);
    }
    encodeSignData(signData):string {
        return [signData.r.toString(16),signData.s.toString(16)].join(',');
    }
    decodeSignString():any {
        const signList = this.signString.split(',');
        return {
            r:BigInt(`0x${signList[0]}`),
            s:BigInt(`0x${signList[1]}`)
        }
    }
    isSame(transactionSign:TransactionSignBase):boolean {
        if(this.signString!==transactionSign.signString) {return false}
        if(!this.transaction.isSame(transactionSign.transaction)) {return false}
        return true
    }
    sign(privateKey: string):string {
        const transactionHash = createHash('sha256').update(this.transaction.serialize()).digest('hex');
        const signData = ecdsa.sign(`0x${privateKey}`,`0x${transactionHash}`);
        this.signString = this.encodeSignData(signData);
        return this.signString;
    }
    verify():boolean {
        const transactionHash = createHash('sha256').update(this.transaction.serialize()).digest('hex');
        const publicKey = base582Hex(this.transaction.senderAdress);
        return ecdsa.verify(ecdsa.publicKeyNum2Point(`0x${publicKey}`),this.decodeSignString(),`0x${transactionHash}`);
    }
}