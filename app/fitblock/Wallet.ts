import {createHash} from 'crypto';
import WalletBase from '../../types/WalletBase';
import {hex2Base58, base582Hex} from './util';
import ecdsa from 'ecdsa-secp256k1';
import Transaction from './Transaction';
import TransactionSign from './transactionSign';
export default class Wallet extends WalletBase {
    setwalletAdress(walletAdress:string):void {
        this.walletAdress = walletAdress;
    }
    genPrivateKeyByString(textData: string): string {
        return createHash('sha256').update(textData).digest('hex');
    }
    genPrivateKeyByRand(): string {
        return ecdsa.randPrivateKeyNum().toString(16);
    }
    getPublicKeyByPrivateKey(privateKey: string): string {
        return ecdsa.publicKeyPoint2HexStr(ecdsa.getPublicKeyPoint(`0x${privateKey}`));
    }
    getWalletAdressByPublicKey(publicKey: string): string {
        return hex2Base58(publicKey);
    }
    getPublicKeyByWalletAdress(walletAdress: string): string {
        return base582Hex(walletAdress);
    }
    genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:Number):TransactionSign {
        const senderAdress = this.getWalletAdressByPublicKey(this.getPublicKeyByPrivateKey(privateKey));
        const transaction = new Transaction(senderAdress,accepterAdress,transCoinNumber);
        const transactionSign = new TransactionSign(transaction);
        transactionSign.sign(privateKey);
        return transactionSign;
    }
}