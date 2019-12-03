import Block from './block'
export default abstract class AppBase{
    name: string;
    godBlock: Block;
    abstract genPrivateKeyByString(data: string): string;
    abstract genPrivateKeyByRand(): string;
    abstract getPublicKeyByPrivateKey(privateKey: string): string;
    abstract getWalletAdressByPublicKey(publicKey: string): string;
    abstract getPublicKeyByWalletAdress(walletAdress: string): string;
} 