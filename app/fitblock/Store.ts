import StoreBase from '../../types/StoreBase';
import Block from './Block';
import config from './config';
import TransactionSign from './TransactionSign';
import {getLoggerInstance} from './Logger'
const logger = getLoggerInstance().getLogger()
export const getStoreInstance = ( ()=> {
    let instance = null;
    return (dbClient:any,tmpVersion:string=''):Store=>{
        if(tmpVersion) {
            const tmpStore =  new Store(config.appName,dbClient);
            tmpStore.tmpVersion = tmpVersion;
            return tmpStore;
        }
        if(instance) {
            return instance;
        }
        instance = new Store(config.appName,dbClient)
        return instance
    }
})();
export default class Store extends StoreBase {
    transactionSignMap = new Map<string, TransactionSign>();
    getGodKey(): string {
        return config.godBlockHash;
    }
    genVersion(): string {
        const value1 = new Date().getTime().toString(16);
        const value2 = (((1+Math.random())*0x1000000) & 0xffffff).toString(16);
        return `${value1}-${value2}`;
    }
    async setVersion(version:string): Promise<boolean> {
        return await this.put(config.blockVersionKey,version)
    }
    async getVersion(): Promise<string> {
        if(this.tmpVersion){return this.tmpVersion;}
        try {
            return await this.get(config.blockVersionKey)
        } catch(err) {
            logger.warn(err)
        }
        const version = this.genVersion()
        await this.setVersion(version)
        return version
    }
    
    getPreGodBlock():Block {
        return Block.getPreGodBlock();
    }
    async getBlockDataKey(preBlock: Block): Promise<string> {
        const version =  await this.getVersion();
        return `#${version}#block:${preBlock.nextBlockHash}:${preBlock.timestamp}`;
    }

    async getLastBlockData(invalidBlock:Block = Block.getInvalidBlock()):Promise<Block> {
        let lastBlock = invalidBlock;  
        for await (const block of await this.blockIterator(invalidBlock)) {
            lastBlock = block;
        }
        return lastBlock;
    }

    getBlockByStr(dataStr:string):Block {
        return Block.createByData(JSON.parse(dataStr));
    }

    async getBlockData(preBlock: Block):Promise<Block> {
        try {
            return this.getBlockByStr(await this.get(await this.getBlockDataKey(preBlock)));
        } catch(err) {
            return Block.getInvalidBlock()
        }
    }

    async keepBlockData(preBlock: Block, block:Block):Promise<boolean> {
        for(const transactionSign of block.transactionSigns) {
            await this.delTransactionSignData(transactionSign);
        }
        await this.clearTimeOutTransactionSign()
        return await this.put(await this.getBlockDataKey(preBlock), JSON.stringify(block));
    }

    async blockIterator(startBlock:Block=Block.getInvalidBlock()): Promise<AsyncIterable<Block>> {
        let nowBlock;
        if(!startBlock.nextBlockHash) {
            nowBlock = await this.getBlockData(this.getPreGodBlock());
        } else {
            nowBlock = await this.getBlockData(startBlock);
        }
        return {
            [Symbol.asyncIterator]:()=> {
                return {
                    next:async ()=>{
                        if(!nowBlock.nextBlockHash) {
                            return {value: nowBlock, done: true}
                        }
                        const nextBlock = await this.getBlockData(nowBlock)
                        const preBlock = nowBlock;
                        nowBlock = nextBlock;
                        return {value: preBlock, done: false}
                    }
                }
            }
        };
    }

    getTransactionSignDataKey(transactionSign:TransactionSign): string {
        return `transaction:${transactionSign.transaction.timestamp.toString()}:${transactionSign.signString}`;
    }

    getTransactionSignByStr(dataStr:string) {
        return TransactionSign.createByData(JSON.parse(dataStr));
    }

    async getTransactionSignMapSize():Promise<number> {
        return this.transactionSignMap.size;
    }

    async clearTimeOutTransactionSign():Promise<boolean> {
        for (const transactionSignItem of this.transactionSignMap) {
            if(transactionSignItem[1].isTimeOut()) {
                this.transactionSignMap.delete(transactionSignItem[0])
            }
        }
        return true;
    }

    async checkIsTransactionSignInMap(transactionSign:TransactionSign):Promise<boolean> {
        let isInMap = false;
        for (const transactionSignItem of this.transactionSignMap) {
            if(transactionSignItem[1].isSame(transactionSign)) {
                isInMap = true;
                break;
            }
        }
        return isInMap
    }

    async getTransactionSignCostInMap(transactionSign:TransactionSign):Promise<number> {
        let costCoinNumber = 0;
        for (const transactionSignItem of this.transactionSignMap) {
            if(
                transactionSignItem[1].transaction.senderAdress === 
                transactionSign.transaction.senderAdress
            ) {
                costCoinNumber+= transactionSignItem[1].transaction.transCoinNumber;
            }
        }
        return costCoinNumber
    }

    async checkIsTransactionSignInBlock(transactionSign:TransactionSign,startBlock:Block=Block.getPreGodBlock()):Promise<string> {
        let inBlockHash = '';
        let nextBlockHash = startBlock.nextBlockHash;
        for await (const block of await this.blockIterator(startBlock)) {
            if(block.isTransactionSignIn(transactionSign)) {
                inBlockHash = nextBlockHash;
                break;
            }
            nextBlockHash = block.nextBlockHash
        }
        return inBlockHash
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
    async transactionSignIterator(): Promise<AsyncIterable<TransactionSign>> {
        const transactionSignMapIterator = this.transactionSignMap[Symbol.iterator]();
        return {
            [Symbol.asyncIterator]:()=> {
                return {
                    next:async ()=>{
                        const res = transactionSignMapIterator.next();
                        if(res.value && res.value.length===2) {
                            return {value:res.value[1], done: res.done}
                        }
                        return {value:undefined, done: res.done}
                    }
                }
            }
        }
    }
}