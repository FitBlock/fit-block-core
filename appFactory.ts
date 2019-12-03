import AppBase from './appBase';
import fitblock from './app/fitblock';
const classMap = {fitblock};
const instanceMap: Map<String, AppBase> = new Map(); 
export default class AppFactory {
    static getAppByName(name: String): AppBase {
        if(instanceMap.has(name)) {
            return instanceMap.get(name);
        }
        const appObj:AppBase = new classMap[name.toLowerCase()]();
        instanceMap.set(name, appObj);
        return appObj;
    }
}