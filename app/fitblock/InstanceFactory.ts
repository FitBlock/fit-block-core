import Wallet from './Wallet'
import CoinWorker from './CoinWorker' 
const instanceMap: Map<String, any> = new Map(); 
function getInstance<T>(name:string,dbClient:any):T {
    if(instanceMap.has(name)) {
        return instanceMap.get(name);
    }
    switch(name.toLowerCase()) {
        case 'wallet':
            instanceMap.set(name, new Wallet(dbClient));
            break;
        case 'coinworker':
            instanceMap.set(name, new CoinWorker(dbClient));
            break;
        default:
            throw new Error('not support module.')
    }
    return instanceMap.get(name);
}
export default class InstanceFactory {
    static getWalletInstance(dbClient:any):Wallet {
        return getInstance<Wallet>('Wallet', dbClient);
    }
    static getCoinWorkerInstance(dbClient:any):CoinWorker {
        return getInstance<CoinWorker>('CoinWorker', dbClient);
    }
}