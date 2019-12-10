import level from 'level';
import {dirname as pathDirname, join as pathJoin} from 'path';
export enum witreOperate {
    Del = "del",
    Put = "put",
}
export abstract class BatchOperate {
    abstract type: witreOperate;
    abstract key: string;
    abstract value:any;
}
export abstract class QueryOptions {
    abstract gt:string;
    abstract gte:string;
    abstract lt:string;
    abstract lte:string;
    abstract reverse:boolean = false;
    abstract limit:number = -1;
    abstract keys:boolean = true;
    abstract values:boolean = true;
}
export abstract class Leveliterator {
    abstract db:level;
    abstract next(callback:Function):void;
    abstract seek(targetKey:string):void;
    abstract end(callback:Function):void;
}

export class LevelDB {
    dbName: string;
    dbPath: string;
    db: level;
    constructor(dbName) {
        this.dbName = dbName;
        this.dbPath = pathJoin(pathDirname(__dirname),'data',this.dbName);
        this.db = level(this.dbPath,{ valueEncoding: 'json' })
    }

    async put(key: string, value:any):Promise<boolean> {
        return await this.db.put(key, value);
    }

    async get(key: string):Promise<any>  {
        return await this.db.get(key);
    }

    query(queryOptions:QueryOptions):ReadableStream {
        return this.db.createReadStream(queryOptions);
    }

    async del(key: string):Promise<boolean>  {
        return await this.db.del(key);
    }

    async batch(batchOperate:Array<BatchOperate>):Promise<boolean>  {
        return await this.db.batch(batchOperate);
    }
}

export default LevelDB;
