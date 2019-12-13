import {getRandHexNumByDigit} from './util';
import Wallet from './Wallet';
import Block from './Block';
import TransactionSign from './transactionSign';
import AppBase from '../../types/AppBase';
import config from './config'
export default class FitBlock extends AppBase {
    name: string;
    godBlock: Block;
    myWallet: Wallet;
    constructor() {
        super();
        this.name = 'fitblock';
        this.myWallet = new Wallet();
        this.myWallet.setwalletAdress(config.selfWalletAdress);
    }

    genGodBlock():void {
        this.godBlock = new Block();
        this.godBlock.outBlock(getRandHexNumByDigit(config.initBlockValLen),config.selfWalletAdress);
    }

    loadGodBlock():void {
        throw new Error("Method not implemented.");
    }

    genPrivateKeyByString(textData: string): string {
        return this.myWallet.genPrivateKeyByString(textData);
    }
    genPrivateKeyByRand(): string {
        return this.myWallet.genPrivateKeyByRand();
    }
    getPublicKeyByPrivateKey(privateKey: string): string {
        return this.myWallet.getPublicKeyByPrivateKey(privateKey);
    }
    getWalletAdressByPublicKey(publicKey: string): string {
        return this.myWallet.getWalletAdressByPublicKey(publicKey);
    }
    getPublicKeyByWalletAdress(walletAdress: string): string {
        return this.myWallet.getPublicKeyByWalletAdress(walletAdress);
    }

    genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:number):TransactionSign {
        return this.myWallet.genTransaction(privateKey,accepterAdress,transCoinNumber);
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