import AppBase from './AppBase';
import {LevelDB,BatchOperate,QueryOptions} from './util/level'
export default abstract class StoreBase{
    appName: string;
    db: LevelDB;
    constructor(app:AppBase) {
        this.appName = app.name;
        this.checkAppName(this.appName);
        this.db = new LevelDB(this.appName);
    }

    checkAppName(appName:string):boolean {
        if(!(/^[a-z]{1}[a-z0-9_-]{1,30}$/u).test(appName)) {
            throw new Error('app name must begin with a lower letter and spell with a-z0-9_-');
        }
        return true;
    }

    async put(key: string, value:any):Promise<boolean> {
        return await this.db.put(key, value);
    }

    async get(key: string):Promise<any>  {
        return await this.db.get(key);
    }

    query(queryOptions:QueryOptions):AsyncIterable<any> {
        return this.db.query(queryOptions);
    }

    async del(key: string):Promise<boolean>  {
        return await this.db.del(key);
    }

    async batch(batchOperate:Array<BatchOperate>):Promise<boolean>  {
        return await this.db.batch(batchOperate);
    }
}