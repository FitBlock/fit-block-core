export default abstract class AppBase{
    name: string;
    abstract genPrivateKeyByString(data: String): String;
    abstract genPrivateKeyByRand(): String;
    abstract getPublicKeyByPrivateKey(privateKey: String): String;
    abstract getWalletAdressByPublicKey(publicKey: String): String
} 