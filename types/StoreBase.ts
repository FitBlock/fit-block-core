import blockStore from 'fit-block-store';
const dbClient = blockStore.getClient();
import BlockBase from './BlockBase'
import TransactionSignBase from './TransactionSignBase'
export default  abstract class StoreBase{
    private appName: string;
    transactionSignMap = new Map<string, TransactionSignBase>();
    constructor(appName:string) {
        this.appName = appName;
        this.checkAppName(this.appName);
    }
    abstract getGodKey(): string ;
    abstract getBlockDataKey(blockHash:string):string;

    abstract async getBlockData(blockHash:string):Promise<BlockBase>;

    abstract async keepBlockData(blockHash:string, Block:BlockBase):Promise<boolean>;

    abstract async blockIterator(blockData:BlockBase): Promise<AsyncIterable<BlockBase>>;

    abstract  getTransactionSignMapSize():number;

    abstract getTransactionSignDataKey(transactionSign:TransactionSignBase): string;

    abstract delTransactionSignData(transactionSign:TransactionSignBase):Promise<boolean>;

    abstract async checkIsTransactionSignInBlock(transactionSign:TransactionSignBase):Promise<boolean>;

    abstract async keepTransactionSignData(transactionSign:TransactionSignBase):Promise<boolean>;

    abstract async transactionSignIterator(): Promise<AsyncIterable<TransactionSignBase>>;

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
        return await dbClient.get(key);
    }

    async del(key: string):Promise<boolean>  {
        await this.conect();
        return await dbClient.del(key);
    }
}