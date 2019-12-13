export default abstract class WalletBase {
    walletAdress:string;
    constructor() {
        
    }
    abstract setwalletAdress(walletAdress:string):void;
    abstract genPrivateKeyByString(textData: string): string;
    abstract genPrivateKeyByRand(): string;
    abstract getPublicKeyByPrivateKey(privateKey: string): string;
    abstract getWalletAdressByPublicKey(publicKey: string): string;
    abstract getPublicKeyByWalletAdress(walletAdress: string): string;
}