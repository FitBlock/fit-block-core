import {createHash} from 'crypto';
import WalletBase from '../../types/WalletBase';
import {hex2Base58, base582Hex} from './util/base58';
import ecdsa from 'ecdsa-secp256k1';
import Transaction from './Transaction';
import TransactionSign from './TransactionSign';
import {getStoreInstance} from './Store'
import Store from './Store'
import Block from './Block';
export default class Wallet extends WalletBase {
    myStore:Store;
    constructor(dbClient:any) {
        super();
        this.myStore = getStoreInstance(dbClient);
    }
    genPrivateKeyByString(textData: string): string {
        return createHash('sha256').update(textData).digest('hex');
    }
    genPrivateKeyByRand(): string {
        return ecdsa.randPrivateKeyNum().toString(16);
    }
    getPublicKeyByPrivateKey(privateKey: string): string {
        return BigInt(`${ecdsa.publicKeyPoint2HexStr(
            ecdsa.getPublicKeyPoint(`0x${privateKey}`)
        )}`).toString(16);
    }
    getWalletAdressByPublicKey(publicKey: string): string {
        return hex2Base58(publicKey);
    }
    getPublicKeyByWalletAdress(walletAdress: string): string {
        return base582Hex(walletAdress);
    }
    async getCoinNumberyByWalletAdress(walletAdress: string): Promise<number> {
        let coinNum = 0;
        for await (const block of await this.myStore.blockIterator()) {
            coinNum+=block.getCoinNumberyByWalletAdress(walletAdress);
            if(coinNum===Infinity) {
                throw new Error("wallet coin number have range");
            }
            if(coinNum<0) {
                throw new Error("wallet coin number not be minus");
            }
        }
        return coinNum;
    }

    async getTransactionsByWalletAdress(
        walletAdress: string,
        startBlock:Block=Block.getInvalidBlock(),
        limit:number=10
    ): Promise<Array<TransactionSign>> {
        const transactions = [];
        for await (const block of await this.myStore.blockIterator(startBlock)) {
            transactions.push(...block.getTransactionsByWalletAdress(walletAdress));
            if(transactions.length>=limit){
                break;
            }
        }
        return transactions;
    }
    genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:number):TransactionSign {
        const senderAdress = this.getWalletAdressByPublicKey(this.getPublicKeyByPrivateKey(privateKey));
        const transaction = new Transaction(senderAdress,accepterAdress,transCoinNumber);
        const transactionSign = new TransactionSign(transaction);
        transactionSign.sign(privateKey);
        return transactionSign;
    }
}