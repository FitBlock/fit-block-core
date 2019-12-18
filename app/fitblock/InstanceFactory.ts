import config from './config';
import Store from './Store'
import Wallet from './Wallet'
import CoinWorker from './CoinWorker' 
const instanceMap: Map<String, any> = new Map(); 
function getInstance<T>(name:string):T {
    if(instanceMap.has(name)) {
        return instanceMap.get(name);
    }
    switch(name.toLowerCase()) {
        case 'store':
            instanceMap.set(name, new Store(config.appName));
            break;
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
    static getStoreInstance():Store {
        return getInstance<Store>('Store');
    }
    static getCoinWorkerInstance():CoinWorker {
        return getInstance<CoinWorker>('CoinWorker');
    }
}