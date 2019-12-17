import {getRandHexNumByDigit} from './util/index';
import Wallet from './Wallet';
import Block from './Block';
import TransactionSign from './transactionSign';
import AppBase from '../../types/AppBase';
import config from './config';
const myWallet = new Wallet();
export default class FitBlock extends AppBase {
    name: string;
    godBlock: Block;
    constructor() {
        super();
        this.name = 'fitblock';
    }

    genGodBlock():void {
        this.godBlock = new Block(config.godWalletAdress);
        this.godBlock.outBlock(getRandHexNumByDigit(config.initBlockValLen));
    }

    loadGodBlock():void {
        throw new Error("Method not implemented.");
    }

    genPrivateKeyByString(textData: string): string {
        return myWallet.genPrivateKeyByString(textData);
    }
    genPrivateKeyByRand(): string {
        return myWallet.genPrivateKeyByRand();
    }
    getPublicKeyByPrivateKey(privateKey: string): string {
        return myWallet.getPublicKeyByPrivateKey(privateKey);
    }
    getWalletAdressByPublicKey(publicKey: string): string {
        return myWallet.getWalletAdressByPublicKey(publicKey);
    }
    getPublicKeyByWalletAdress(walletAdress: string): string {
        return myWallet.getPublicKeyByWalletAdress(walletAdress);
    }

    genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:number):TransactionSign {
        return myWallet.genTransaction(privateKey,accepterAdress,transCoinNumber);
    }

    //  优先同步区块，传播未成块的交易数据
    sendTransaction():TransactionSign {
        throw new Error("Method not implemented.");
    }
    acceptTransaction(transactionSign:TransactionSign):TransactionSign {
        throw new Error("Method not implemented.");
    }
    // 通过区块hash值获取要发送的区块
    sendBlockByHash(blockHash: string): Block {
        throw new Error("Method not implemented.");
    }
    // 接收区块数据,并标记在块中已交易的交易数据为交易成功
    acceptBlock(block: Block): string {
        return '';
    }
}