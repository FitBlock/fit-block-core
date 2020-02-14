import AppBase from './types/AppBase';
import Fitblock from './app/fitblock';
const instanceMap: Map<String, any> = new Map(); 
export default class AppFactory {
    static getAppByName(name: string, dbClient:any) {
        switch(name.toLowerCase()) {
            case 'fitblock':
                return AppFactory.getAppByClass<Fitblock>(Fitblock, dbClient);
            default:
                throw new Error('not support app.')
        }
    }

    static getAppByClass<T extends AppBase>(app: new (dbClient:any) => T,dbClient:any):T {
        if(instanceMap.has(app.name)) {
            return instanceMap.get(app.name);
        }
        const appInstance = new app(dbClient)
        instanceMap.set(app.name, appInstance)
        return appInstance;
    }
}