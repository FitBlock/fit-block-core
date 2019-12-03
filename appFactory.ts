import AppBase from './appBase';
const instanceMap: Map<String, AppBase> = new Map(); 
export default class AppFactory {
    static async getAppByName(name: String): Promise<AppBase> {
        if(instanceMap.has(name)) {
            return instanceMap.get(name);
        }
        const appObj:AppBase = await import(`./app/${name.toLowerCase()}`);
        instanceMap.set(name, appObj);
        return appObj;
    }
}