import BlockBase from './BlockBase'
import TransactionSignBase from './TransactionSignBase';
export default abstract class WalletBase {
    abstract genPrivateKeyByString(textData: string): string;
    abstract genPrivateKeyByRand(): string;
    abstract getPublicKeyByPrivateKey(privateKey: string): string;
    abstract getWalletAdressByPublicKey(publicKey: string): string;
    abstract getPublicKeyByWalletAdress(walletAdress: string): string;
    abstract getCoinNumberyByWalletAdress(
        walletAdress: string,
        startBlock:BlockBase
    ): Promise<{lastBlock:BlockBase,coinNumber:number}>;
    abstract async getMiningCoinNumberyByWalletAdress(
        walletAdress: string,
        startBlock:BlockBase
    ): Promise<{lastBlock:BlockBase,coinNumber:number}>
    abstract async getTransactionsByWalletAdress(
        walletAdress: string,
        startBlock:BlockBase,
        limit:number
    ): Promise<{lastBlock:BlockBase,transactions:Array<TransactionSignBase>}>
}