import BlockBase from './BlockBase'
import TransactionSignBase from './TransactionSignBase'
export default abstract class AppBase{
    abstract name: string;
    abstract godBlock: BlockBase;
    abstract genGodBlock():Promise<void>;
    abstract loadGodBlock():Promise<void>;
    abstract genPrivateKeyByString(data: string): string;
    abstract genPrivateKeyByRand(): string;
    abstract getPublicKeyByPrivateKey(privateKey: string): string;
    abstract getWalletAdressByPublicKey(publicKey: string): string;
    abstract getPublicKeyByWalletAdress(walletAdress: string): string;
    abstract async genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:number):Promise<TransactionSignBase>;
    abstract async getCoinNumberyByWalletAdress(walletAdress: string): Promise<number>
    //  优先同步区块，传播未成块的交易数据
    abstract async sendTransaction():Promise<Array<TransactionSignBase>>
    // 优先同步区块，判断交易是否已存在，如果不存在则接收新的交易数据
    abstract async acceptTransaction(transactionSign:TransactionSignBase):Promise<TransactionSignBase>;
    // 通过区块hash值发送区块
    abstract async sendBlockByHash(blockHash: string): Promise<BlockBase>;
    // 接收区块数据,并标记在块中已交易的交易数据为交易成功
    abstract async acceptBlock(blockHash: string, nextblock: BlockBase): Promise<string>;

    abstract async mining(): Promise<BlockBase>;
} 