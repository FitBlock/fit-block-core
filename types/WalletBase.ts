import BlockBase from './BlockBase'
import TransactionSignBase from './TransactionSignBase';
export default abstract class WalletBase {
    abstract genPrivateKeyByString(textData: string): string;
    abstract genPrivateKeyByRand(): string;
    abstract getPublicKeyByPrivateKey(privateKey: string): string;
    abstract getWalletAdressByPublicKey(publicKey: string): string;
    abstract getPublicKeyByWalletAdress(walletAdress: string): string;
    abstract getCoinNumberyByWalletAdress(walletAdress: string): Promise<number>;
    abstract async getTransactionsByWalletAdress(
        walletAdress: string,
        startBlock:BlockBase,
        limit:number
    ): Promise<Array<TransactionSignBase>>
}