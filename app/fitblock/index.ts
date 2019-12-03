import BKG from 'bitcoin-key-generator';
import Block from '../../types/block'
import AppBase from '../../types/appBase';
export default class FitBlock extends AppBase {
    name: String;
    godBlock: Block;
    constructor() {
        super();
        this.name = 'fitblock';
        this.godBlock = new Block();
    }
    genPrivateKeyByString(data: String): String {
        return BKG.getPrivteKeyByOrigin(BKG.getPrivteOriginKeyByStr(data));
    }

    genPrivateKeyByRand(): String {
        return BKG.getPrivteKeyByOrigin(BKG.getPrivteOriginKeyByRand());
    }
    getPublicKeyByPrivateKey(privateKey: String): String {
        return BKG.getPublicOriginKey(BKG.getPrivteOriginKeyByKey(privateKey));
    }
    getWalletAdressByPublicKey(publicKey: String): String {
        return BKG.getPublicKeyByOrigin(publicKey);
    }
}