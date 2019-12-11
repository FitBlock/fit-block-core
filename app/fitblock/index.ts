import {createHash} from 'crypto';
import {hex2Base58, base582Hex} from './util';
import ecdsa from 'ecdsa-secp256k1';
import Block from './Block';
import Transaction from './Transaction';
import TransactionSign from './transactionSign';
import AppBase from '../../types/AppBase';
import config from './config'
export default class FitBlock extends AppBase {
    name: string;
    godBlock: Block;
    constructor() {
        super();
        this.name = 'fitblock';
        this.godBlock = new Block();
        const godPrivateKey = FitBlock.genPrivateKeyByRand();
        const godWalletAdress = FitBlock.getWalletAdressByPublicKey(
            FitBlock.getPublicKeyByPrivateKey(godPrivateKey)
        );
        this.godBlock.outBlock(Buffer.allocUnsafe(config.blockValLen).toString('hex'),godWalletAdress);
    }
    static genPrivateKeyByString(data: string): string {
        return createHash('sha256').update(data).digest('hex');
    }
    static genPrivateKeyByRand(): string {
        return ecdsa.randPrivateKeyNum().toString(16);
    }
    static getPublicKeyByPrivateKey(privateKey: string): string {
        return ecdsa.publicKeyPoint2HexStr(ecdsa.getPublicKeyPoint(`0x${privateKey}`));
    }
    static getWalletAdressByPublicKey(publicKey: string): string {
        return hex2Base58(publicKey);
    }
    static getPublicKeyByWalletAdress(walletAdress: string): string {
        return base582Hex(walletAdress);
    }

    genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:Number):TransactionSign {
        const senderAdress = this.getWalletAdressByPublicKey(this.getPublicKeyByPrivateKey(privateKey));
        const transaction = new Transaction(senderAdress,accepterAdress,transCoinNumber);
        const signData = ecdsa.sign(`0x${privateKey}`,transaction.serialize());
        return new TransactionSign(transaction,signData);
    }

    //  优先同步区块，传播未成块的交易数据
    sendTransaction():TransactionSign {
        throw new Error("Method not implemented.");
    }
    acceptTransaction(transactionSign:TransactionSign):TransactionSign {
        throw new Error("Method not implemented.");
    }
    // 通过区块hash值发送区块
    sendBlockByHash(blockHash: string): Block {
        return new Block();
    }
    // 接收区块数据,并标记在块中已交易的交易数据为交易成功
    acceptBlock(block: Block): string {
        return '';
    }
}