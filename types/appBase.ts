import BlockBase from './BlockBase'
import TransactionSignBase from './TransactionSignBase'
export default abstract class AppBase{
    abstract name: string;
    abstract godBlock: BlockBase;
    abstract genGodBlock():void;
    abstract loadGodBlock():void;
    abstract genPrivateKeyByString(data: string): string;
    abstract genPrivateKeyByRand(): string;
    abstract getPublicKeyByPrivateKey(privateKey: string): string;
    abstract getWalletAdressByPublicKey(publicKey: string): string;
    abstract getPublicKeyByWalletAdress(walletAdress: string): string;
    abstract genTransaction(privateKey: string,accepterAdress: string,transCoinNumber:number):TransactionSignBase;
    //  优先同步区块，传播未成块的交易数据
    abstract sendTransaction():TransactionSignBase;
    // 优先同步区块，判断交易是否已存在，如果不存在则接收新的交易数据
    abstract acceptTransaction(transaction:TransactionSignBase):TransactionSignBase;
    // 通过区块hash值发送区块
    abstract sendBlockByHash(blockHash: string): BlockBase;
    // 接收区块数据,并标记在块中已交易的交易数据为交易成功
    abstract acceptBlock(block: BlockBase): string;
} 