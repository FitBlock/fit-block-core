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
        return await this.db.put(this.addKeyQuery(key), value);
    }

    async get(key: string):Promise<any>  {
        return await this.db.get(this.addKeyQuery(key));
    }

    async del(key: string):Promise<boolean>  {
        return await this.db.del(this.addKeyQuery(key));
    }

    addKeyQuery(query: string):string {
        return `${this.appName}:${query}`
    }

    addKeyQueryOptions(queryOptions: QueryOptions):QueryOptions {
        const params = new QueryOptions();
        params.gt = this.addKeyQuery(queryOptions.gt);
        params.gte = this.addKeyQuery(queryOptions.gte);
        params.lt = this.addKeyQuery(queryOptions.lt);
        params.lte = this.addKeyQuery(queryOptions.lte);
        params.reverse = queryOptions.reverse;
        params.limit = queryOptions.limit;
        params.keys = queryOptions.keys;
        params.values = queryOptions.values;
        return params;
    }
    
    addBatchQuery(batchOperate:Array<BatchOperate>):Array<BatchOperate> {
        const batchParams = [];
        for(const Operate of batchOperate) {
            const params = new BatchOperate();
            params.key = this.addKeyQuery(Operate.key);
            params.type = Operate.type;
            params.value = Operate.value;
            batchParams.push(params);
        }
        return batchParams;
    }

    query(queryOptions:QueryOptions):AsyncIterable<any> {
        return this.db.query(this.addKeyQueryOptions(queryOptions));
    }

    async batch(batchOperate:Array<BatchOperate>):Promise<boolean>  {
        return await this.db.batch(this.addBatchQuery(batchOperate));
    }
}