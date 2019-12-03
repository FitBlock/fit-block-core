import {createHash} from 'crypto';
import {hex2Base58, base582Hex} from './util';
import ecdsa from 'ecdsa-secp256k1';
import Block from '../../types/block'
import AppBase from '../../types/appBase';
export default class FitBlock extends AppBase {
    name: string;
    godBlock: Block;
    constructor() {
        super();
        this.name = 'fitblock';
        this.godBlock = new Block();
    }
    genPrivateKeyByString(data: string): string {
        return createHash('sha256').update(data).digest('hex');
    }
    genPrivateKeyByRand(): string {
        return ecdsa.randPrivateKeyNum().toString(16);;
    }
    getPublicKeyByPrivateKey(privateKey: string): string {
        return ecdsa.publicKeyPoint2HexStr(ecdsa.getPublicKeyPoint(privateKey));
    }
    getWalletAdressByPublicKey(publicKey: string): string {
        return hex2Base58(publicKey);
    }
    getPublicKeyByWalletAdress(walletAdress: string): string {
        return base582Hex(walletAdress);
    }
}