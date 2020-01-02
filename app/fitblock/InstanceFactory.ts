import Wallet from './Wallet'
import CoinWorker from './CoinWorker' 
const instanceMap: Map<String, any> = new Map(); 
function getInstance<T>(name:string):T {
    if(instanceMap.has(name)) {
        return instanceMap.get(name);
    }
    switch(name.toLowerCase()) {
        case 'wallet':
            instanceMap.set(name, new Wallet());
            break;
        case 'coinworker':
            instanceMap.set(name, new CoinWorker());
            break;
        default:
            throw new Error('not support module.')
    }
    return instanceMap.get(name);
}
export default class InstanceFactory {
    static getWalletInstance():Wallet {
        return getInstance<Wallet>('Wallet');
    }
    static getCoinWorkerInstance():CoinWorker {
        return getInstance<CoinWorker>('CoinWorker');
    }
}