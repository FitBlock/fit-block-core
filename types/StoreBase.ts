import BlockBase from './BlockBase'
import TransactionSignBase from './TransactionSignBase'
export default  abstract class StoreBase{
    private appName: string;
    tmpVersion: string;
    dbClient:any;
    transactionSignMap = new Map<string, TransactionSignBase>();
    constructor(appName:string,dbClient:any) {
        this.appName = appName;
        this.checkAppName(this.appName);
        this.dbClient = dbClient;
    }
    abstract getGodKey(): string ;
    abstract genVersion(): string ;
    abstract async setVersion(version:string): Promise<boolean> ;
    abstract async getVersion(): Promise<string> ;
        
    abstract getPreGodBlock():BlockBase;

    abstract async getBlockDataKey(preBlock: BlockBase): Promise<string> ;

    abstract getBlockByStr(dataStr:string):BlockBase;

    abstract async getBlockData(preBlock):Promise<BlockBase>;

    abstract async keepBlockData(preBlock, block:BlockBase):Promise<boolean>;

    abstract async blockIterator(blockData:BlockBase): Promise<AsyncIterable<BlockBase>>;

    abstract async  getTransactionSignMapSize():Promise<number>;
    abstract async clearTimeOutTransactionSign():Promise<boolean>;
    abstract getTransactionSignDataKey(transactionSign:TransactionSignBase): string;

    abstract getTransactionSignByStr(dataStr:string):TransactionSignBase;

    abstract delTransactionSignData(transactionSign:TransactionSignBase):Promise<boolean>;

    abstract  async checkIsTransactionSignInMap(transactionSign:TransactionSignBase):Promise<boolean>;

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
        if(await this.dbClient.isConect()){return true;}
        return await this.dbClient.conect(this.appName);
    }

    async put(key: string, value:string):Promise<boolean> {
        await this.conect();
        return await this.dbClient.put(key, value);
    }

    async get(key: string):Promise<string>  {
        await this.conect();
        return await this.dbClient.get(key);
    }

    async del(key: string):Promise<boolean>  {
        await this.conect();
        return await this.dbClient.del(key);
    }
}