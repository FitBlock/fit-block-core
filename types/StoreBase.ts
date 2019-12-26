import blockStore from '../../fit-block-store';
const dbClient = blockStore.getClient();
import BlockBase from './BlockBase'
export default  abstract class StoreBase{
    private appName: string;
    constructor(appName:string) {
        this.appName = appName;
        this.checkAppName(this.appName);
    }
    abstract getGodKey(): string ;
    abstract getBlockDataKey(blockHash:string):string;

    abstract async getBlockData(blockHash:string):Promise<BlockBase>;

    abstract async keepBlockData(blockHash:string, Block:BlockBase):Promise<boolean>;

    private checkAppName(appName:string):boolean {
        if(!(/^[a-z]{1}[a-z0-9_-]{1,30}$/u).test(appName)) {
            throw new Error('app name must begin with a lower letter and spell with a-z0-9_-');
        }
        return true;
    }

    private async conect():Promise<boolean> {
        if(await dbClient.isConect()){return true;}
        return await dbClient.conect(this.appName);
    }

    async put(key: string, value:any):Promise<boolean> {
        await this.conect();
        return await dbClient.put(key, JSON.stringify(value));
    }

    async get(key: string):Promise<any>  {
        await this.conect();
        return JSON.parse(await dbClient.get(key));
    }

    async del(key: string):Promise<boolean>  {
        await this.conect();
        return await dbClient.del(key);
    }
}