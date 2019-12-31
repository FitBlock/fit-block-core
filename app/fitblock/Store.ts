import StoreBase from '../../types/StoreBase';
import Block from './Block';
import config from './config';
import TransactionSign from './TransactionSign';
export default class Store extends StoreBase {
    getGodKey(): string {
        return `godBlock`;
    }
    getBlockDataKey(blockHash: string): string {
        return `block:${blockHash}`;
    }

    async getLastBlockData():Promise<Block> {
        const lastBlockKey = `lastBlockKey`;
        let lastBlock = await this.get(this.getBlockDataKey(lastBlockKey));
        if(!lastBlock) {
            await this.eachBlockData(async (blockData)=>{
                lastBlock = blockData;
            })
        }
        return lastBlock;
    }

    async getBlockData(blockHash:string):Promise<Block> {
        return await this.get(this.getBlockDataKey(blockHash)) || {};
    }

    async keepBlockData(blockHash:string, block:Block):Promise<boolean> {
        for(const transactionSign of block.transactionSigns) {
            await this.keepInBlockTransactionSignData(transactionSign);
        }
        return await this.put(this.getBlockDataKey(blockHash), block);
    }

    async eachBlockData(callback?:(block:Block)=>Promise<void>):Promise<boolean> {
        async function readBlock(blockData) {
            if(!blockData.NextBlockData) {return;}
            await callback(blockData);
            await readBlock(await this.getBlockData(blockData.NextBlockData));
        }
        let godBlockData = await this.getBlockData(this.getGodKey());
        await readBlock(godBlockData);
        return true;
    }

    getTransactionSignDataKey(timestamp:string,signString: string): string {
        return `transaction:${timestamp}:${signString}`;
    }
    
    getInBlockTransactionSignDataKey(timestamp:string,signString: string): string {
        return `inBlockTransaction:${timestamp}:${signString}`;
    }

    async getInBlockTransactionSignData(transactionSign:TransactionSign):Promise<TransactionSign> {
        return await this.get(this.getInBlockTransactionSignDataKey(
            transactionSign.transaction.timestamp.toString(), 
            transactionSign.signString)
        ) || {};
    }

    async keepInBlockTransactionSignData(transactionSign:TransactionSign):Promise<boolean> {
        return await this.put(
            this.getInBlockTransactionSignDataKey(
                transactionSign.transaction.timestamp.toString(), 
                transactionSign.signString), 
        TransactionSign) &&
        await this.del(
            this.getTransactionSignDataKey(
                transactionSign.transaction.timestamp.toString(), 
                transactionSign.signString)
        );
    }

    async keepTransactionSignData(transactionSign:TransactionSign):Promise<boolean> {
        return await this.put(
            this.getTransactionSignDataKey(
                transactionSign.transaction.timestamp.toString(), 
                transactionSign.signString), 
        TransactionSign);
    }

    async eachTransactionSignData(callback?:(transactionSign:TransactionSign)=>Promise<void>):Promise<boolean> {
        const list = await this.query({
            gt:this.getTransactionSignDataKey('',''),
            lt:this.getTransactionSignDataKey('a',''),
            limit:config.maxBlockTransactionSize
        })
        for(let value of list) {
            await callback(JSON.parse(value.value))
        }
        return true;
    }
}