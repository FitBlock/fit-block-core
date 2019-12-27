export default abstract class WalletBase {
    abstract genPrivateKeyByString(textData: string): string;
    abstract genPrivateKeyByRand(): string;
    abstract getPublicKeyByPrivateKey(privateKey: string): string;
    abstract getWalletAdressByPublicKey(publicKey: string): string;
    abstract getPublicKeyByWalletAdress(walletAdress: string): string;
    abstract getCoinNumberyByWalletAdress(walletAdress: string): Promise<number>;
}