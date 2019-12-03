import BKG from 'bitcoin-key-generator';
import AppBase from '../../appBase';
export default class FitBlock extends AppBase {
    name: String;
    constructor() {
        super();
        this.name = 'fitblock';
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