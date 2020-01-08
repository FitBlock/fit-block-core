import StoreBase from '../../types/StoreBase';
import Block from './Block';
import config from './config';
import TransactionSign from './TransactionSign';

export const getStoreInstance = ( ()=> {
    let instance = null;
    return ()=>{
        if(instance) {
            return instance;
        }
        instance = new Store(config.appName)
        return instance
    }
})();
export default class Store extends StoreBase {
    transactionSignMap = new Map<string, TransactionSign>();
    getGodKey(): string {
        return `godBlock`;
    }
    getBlockDataKey(blockHash: string): string {
        return `block:${blockHash}`;
    }

    async getLastBlockData():Promise<Block> {
        let lastBlock = new Block('', -1);
        await this.eachBlockData(async (blockData)=>{
            lastBlock = blockData;
        })
        return lastBlock;
    }

    async getBlockData(blockHash:string):Promise<Block> {
        try {
            const dataStr = await this.get(this.getBlockDataKey(blockHash)) || '{}';
            return JSON.parse(dataStr);
        } catch(err) {
            return new Block('', -1);
        }
    }

    async keepBlockData(blockHash:string, block:Block):Promise<boolean> {
        for(const transactionSign of block.transactionSigns) {
            await this.delTransactionSignData(transactionSign);
        }
        return await this.put(this.getBlockDataKey(blockHash), block);
    }

    async eachBlockData(callback?:(block:Block)=>Promise<void>):Promise<boolean> {
        const readBlock = async (blockData) => {
            if(!blockData.nextBlockHash) {return;}
            await callback(blockData);
            await readBlock(await this.getBlockData(blockData.nextBlockHash));
        }
        let godBlockData = await this.getBlockData(this.getGodKey());
        await readBlock(godBlockData);
        return true;
    }

    getTransactionSignDataKey(transactionSign:TransactionSign): string {
        return `transaction:${transactionSign.transaction.timestamp.toString()}:${transactionSign.signString}`;
    }

    getTransactionSignMapSize():number {
        return this.transactionSignMap.size;
    }

    async delTransactionSignData(transactionSign:TransactionSign):Promise<boolean> {
        this.transactionSignMap.delete(
            this.getTransactionSignDataKey(transactionSign)
        )
        return true;
    }

    async keepTransactionSignData(transactionSign:TransactionSign):Promise<boolean> {
        this.transactionSignMap.set(
            this.getTransactionSignDataKey(transactionSign),
            transactionSign
        )
        return true;
    }

    async eachTransactionSignData(callback?:(transactionSign:TransactionSign)=>Promise<void>):Promise<boolean> {
        for(const transactionSignData of this.transactionSignMap) {
            await callback(transactionSignData[1]);
        }
        return true;
    }
}