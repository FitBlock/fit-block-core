import {getRandHexNumByDigit} from './util/index';
import Block from './Block';
import TransactionSign from './transactionSign';
import AppBase from '../../types/AppBase';
import config from './config';
import InstanceFactory from './InstanceFactory';
const myWallet = InstanceFactory.getWalletInstance();
const myStore = InstanceFactory.getStoreInstance();
const myCoinWorker = InstanceFactory.getCoinWorkerInstance();
export default class FitBlock extends AppBase {
    name: string;
    godBlock: Block;
    constructor() {
        super();
        this.name = config.appName;
    }

    async genGodBlock():Promise<void> {
        this.godBlock = new Block(config.godWalletAdress, 0);
        this.godBlock.outBlock(getRandHexNumByDigit(config.initBlockValLen, 10));
        await myStore.keepBlockData(myStore.getGodKey(),this.godBlock)
    }

    async loadGodBlock():Promise<void> {
        this.godBlock = await myStore.getBlockData(myStore.getGodKey());
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
    async sendTransaction():Promise<Array<TransactionSign>> {
        const transactionSignList = [];
        await myStore.eachTransactionSignData(async (transactionSign)=>{
            transactionSignList.push(transactionSign)
        })
        return transactionSignList;
    }
    async acceptTransaction(transactionSign:TransactionSign):Promise<TransactionSign> {
        const inBlockTransactionSign = await myStore.getInBlockTransactionSignData(transactionSign);
        if(inBlockTransactionSign) {
            return inBlockTransactionSign;
        }
        if(!transactionSign.verify()) {
            throw `nextBlock not pass verify`
        }
        await myStore.keepTransactionSignData(transactionSign);
        return transactionSign;
    }
    // 通过区块hash值获取要发送的区块
    async sendBlockByHash(blockHash: string): Promise<Block> {
        throw await myStore.getBlockData(blockHash);;
    }
    // 接收区块数据,并标记在块中已交易的交易数据为交易成功
    async acceptBlock(blockHash: string, nextblock: Block): Promise<string> {
        const lastBlock = await myStore.getBlockData(blockHash);
        if(!lastBlock.verifyNextBlock(nextblock)) {
            throw `nextBlock not pass verify`
        }
        await myStore.keepBlockData(blockHash, nextblock)
        return nextblock.nextBlockHash;
    }
    async mining(): Promise<Block> {
        return await myCoinWorker.mining();
    }
}