import {createHash} from 'crypto';
import WalletBase from '../../types/WalletBase';
import {hex2Base58, base582Hex} from './util/base58';
import ecdsa from 'ecdsa-secp256k1';
import Transaction from './Transaction';
import TransactionSign from './transactionSign';
import InstanceFactory from './InstanceFactory';
import {getStoreInstance} from './Store'
const myStore = getStoreInstance();
export default class Wallet extends WalletBase {
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
    async getCoinNumberyByWalletAdress(walletAdress: string): Promise<number> {
        let coinNum = 0;
        await myStore.eachBlockData(async (blockData)=>{
            coinNum+=blockData.getCoinNumByWalletAdress(walletAdress);
            if(coinNum<0) {
                throw new Error("wallet coin number not be minus");
            }
        })
        return coinNum;
    }
    genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:number):TransactionSign {
        const senderAdress = this.getWalletAdressByPublicKey(this.getPublicKeyByPrivateKey(privateKey));
        const transaction = new Transaction(senderAdress,accepterAdress,transCoinNumber);
        const transactionSign = new TransactionSign(transaction);
        transactionSign.sign(privateKey);
        return transactionSign;
    }
}