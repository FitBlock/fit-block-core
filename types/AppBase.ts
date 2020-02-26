import BlockBase from './BlockBase'
import StoreBase from './StoreBase'
import TransactionSignBase from './TransactionSignBase'
export default abstract class AppBase{
    abstract name: string;
    abstract dbClient: any;
    abstract getConfig():any;
    abstract getStore():StoreBase;
    abstract async genGodBlock():Promise<BlockBase>;
    abstract verifyGodBlock(godBlock:BlockBase):boolean;
    abstract getPreGodBlock():BlockBase;
    abstract async keepGodBlockData(godBlock:BlockBase):Promise<boolean>
    abstract async loadGodBlock():Promise<BlockBase>;
    abstract async keepBlockData(preBlock:BlockBase ,block:BlockBase):Promise<boolean>;
    abstract async loadLastBlockData():Promise<BlockBase>;
    abstract genPrivateKeyByString(data: string): string;
    abstract genPrivateKeyByRand(): string;
    abstract getPublicKeyByPrivateKey(privateKey: string): string;
    abstract getWalletAdressByPublicKey(publicKey: string): string;
    abstract getPublicKeyByWalletAdress(walletAdress: string): string;
    abstract async genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:number):Promise<TransactionSignBase>;
    abstract async keepTransaction(transactionSign:TransactionSignBase):Promise<Boolean>;
    abstract async getTransactionsByWalletAdress(
        walletAdress: string,
        startBlock:BlockBase,
        limit:number
    ): Promise<{
        lastBlock:BlockBase,
        transactions:Array<TransactionSignBase>
    }>
    abstract async getCoinNumberyByWalletAdress(
        walletAdress: string,
        startBlock:BlockBase
    ): Promise<{lastBlock:BlockBase,coinNumber:number}>
    abstract async getMiningCoinNumberyByWalletAdress(
        walletAdress: string,
        startBlock:BlockBase
    ): Promise<{lastBlock:BlockBase,coinNumber:number}>
    //  优先同步区块，传播未成块的交易数据
    abstract async sendTransaction():Promise<Array<TransactionSignBase>>
    // 优先同步区块，判断交易是否已存在，如果不存在则接收新的交易数据
    abstract async acceptTransaction(transactionSign:TransactionSignBase):Promise<TransactionSignBase>;
    // 通过区块hash值发送区块
    abstract async sendBlockByPreBlock(preBlock: BlockBase): Promise<BlockBase>;
    // 接收区块数据,并标记在块中已交易的交易数据为交易成功
    abstract async acceptBlock(preBlock: BlockBase, nextblock: BlockBase): Promise<BlockBase>;

    abstract async mining(
        preBlock:BlockBase, miningAddress:string, 
        transactionSignList:Array<TransactionSignBase>,
        miningAop:(nextBlock: BlockBase, isComplete:boolean)=>Promise<boolean>,
        startBigInt:bigint): Promise<BlockBase>;
} 