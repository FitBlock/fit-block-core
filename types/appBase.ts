import Block from './block'
export default abstract class AppBase{
    name: String;
    godBlock: Block;
    abstract genPrivateKeyByString(data: String): String;
    abstract genPrivateKeyByRand(): String;
    abstract getPublicKeyByPrivateKey(privateKey: String): String;
    abstract getWalletAdressByPublicKey(publicKey: String): String
} 