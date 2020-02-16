import {getRandHexNumByDigit} from './util/index';
import Block from './Block';
import TransactionSign from './TransactionSign';
import AppBase from '../../types/AppBase';
import config from './config';
import InstanceFactory from './InstanceFactory';
import {getStoreInstance} from './Store'
import Store from './Store'
import Wallet from './Wallet'
import CoinWorker from './CoinWorker'
export default class FitBlock extends AppBase {
    name: string;
    dbClient: any;
    myWallet:Wallet;
    myCoinWorker:CoinWorker;
    constructor(dbClient:any) {
        super();
        this.name = config.appName;
        this.dbClient = dbClient
        this.myWallet = InstanceFactory.getWalletInstance(dbClient);
        this.myCoinWorker = InstanceFactory.getCoinWorkerInstance(dbClient);
    }
    
    getConfig() {
        return config;
    }

    getStore(tmpVersion:string=''):Store {
        // if tmpVersion is exist then this instance is temp
        const myStore = getStoreInstance(this.dbClient, tmpVersion);
        return myStore;
    }

    async genGodBlock():Promise<Block> {
        const godBlock = new Block(config.godWalletAdress, config.godBlockHeight);
        godBlock.blockVal = getRandHexNumByDigit(config.initBlockValLen, config.blockValRadix);
        godBlock.outBlock(godBlock);
        return godBlock;
    }

    verifyGodBlock(godBlock:Block):boolean {
     return godBlock.verifyGodBlock(godBlock);
    }

    getPreGodBlock():Block {
        return this.getStore().getPreGodBlock();
    }

    async keepGodBlockData(godBlock:Block):Promise<boolean> {
        const myStore = this.getStore();
        await myStore.setVersion(myStore.genVersion())
        return await myStore.keepBlockData(myStore.getPreGodBlock(),godBlock)
    }

    async loadGodBlock():Promise<Block> {
        return await this.getStore().getBlockData(this.getStore().getPreGodBlock());
    }

    async keepBlockData(preBlock:Block ,block:Block):Promise<boolean> {
        return await this.getStore().keepBlockData(preBlock, block)
    }

    async loadLastBlockData():Promise<Block> {
        return await this.getStore().getLastBlockData();
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

    async genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:number):Promise<TransactionSign> {
        const transactionSign= this.myWallet.genTransaction(privateKey,accepterAdress,transCoinNumber);
        return transactionSign;
    }

    async keepTransaction(transactionSign:TransactionSign):Promise<Boolean> {
        return await this.getStore().keepTransactionSignData(transactionSign);
    }

    async mining(preBlock:Block, range: Array<bigint> = [0n,-1n]): Promise<Block> {
        return await this.myCoinWorker.mining(preBlock, range);
    }

    async getTransactionsByWalletAdress(
        walletAdress: string,
        startBlock:Block=Block.getInvalidBlock(),
        limit:number=10
    ): Promise<Array<TransactionSign>> {
        return await this.myWallet.getTransactionsByWalletAdress(
            walletAdress,startBlock,limit
        );
    }

    async getCoinNumberyByWalletAdress(walletAdress: string): Promise<number> {
        return await this.myWallet.getCoinNumberyByWalletAdress(walletAdress);
    }
    /**
     * 优先同步区块，传播未成块的交易数据
     * 同时如果交易超时，需要有重试机制重新发起交易，直到交易成功
     */
    async sendTransaction():Promise<Array<TransactionSign>> {
        const transactionSignList = [];
        for await (const transactionSign of await this.getStore().transactionSignIterator()) {
            transactionSignList.push(transactionSign)
        }
        return transactionSignList;
    }
    async acceptTransaction(transactionSign:TransactionSign):Promise<TransactionSign> {
        if(await this.getStore().getTransactionSignMapSize()>config.maxBlockTransactionSize) {
            throw new Error(`transactionSign is enough`)
        }
        if(transactionSign.isTimeOut()) {
            throw new Error(`transactionSign is timeout`)
        }
        if(await this.getStore().checkIsTransactionSignInMap(transactionSign)) {
            throw new Error(`transactionSign is already exist`)
        }
        if(await this.getStore().checkIsTransactionSignInBlock(transactionSign)) {
            throw new Error(`transactionSign is already in block`)
        }
        if(!transactionSign.verify()) {
            throw new Error(`nextBlock not pass verify`)
        }
        return transactionSign;
    }
    // 通过区块hash值获取要发送的区块
    async sendBlockByPreBlock(preBlock: Block): Promise<Block> {
        return await this.getStore().getBlockData(preBlock);
    }
    // 接收区块数据
    async acceptBlock(preBlock: Block, nextblock: Block): Promise<Block> {
        if(
            this.getPreGodBlock().isSame(preBlock) && 
            this.verifyGodBlock(nextblock)
        ) {
            return nextblock;
        }
        if(preBlock.height === config.godBlockHeight-1) {
            throw new Error(`pre block has bad height`)
        }
        if(!preBlock.verifyNextBlock(nextblock)) {
            throw new Error(`nextBlock not pass verify`)
        }
        return nextblock;
    }
}