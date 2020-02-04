import StoreBase from '../../types/StoreBase';
import Block from './Block';
import config from './config';
import TransactionSign from './TransactionSign';

export const getStoreInstance = ( ()=> {
    let instance = null;
    return ():Store=>{
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
        return config.godBlockHash;
    }
    getPreGodBlock():Block {
        const preGodBlock = new Block('',config.godBlockHeight-1);
        preGodBlock.timestamp = 0;
        preGodBlock.nextBlockHash = this.getGodKey();
        return preGodBlock;
    }
    getBlockDataKey(preBlock: Block): string {
        return `block:${preBlock.nextBlockHash}:${preBlock.timestamp}`;
    }

    async getLastBlockData():Promise<Block> {
        let lastBlock = new Block('', config.godBlockHeight-1);  
        for await (const block of await this.blockIterator()) {
            lastBlock = block;
        }
        return lastBlock;
    }

    getBlockByStr(dataStr:string):Block {
        return Block.createByData(JSON.parse(dataStr));
    }

    async getBlockData(preBlock: Block):Promise<Block> {
        try {
            return this.getBlockByStr(await this.get(this.getBlockDataKey(preBlock)));
        } catch(err) {
            return new Block('', config.godBlockHeight-1);
        }
    }

    async keepBlockData(preBlock: Block, block:Block):Promise<boolean> {
        for(const transactionSign of block.transactionSigns) {
            await this.delTransactionSignData(transactionSign);
        }
        return await this.put(this.getBlockDataKey(preBlock), JSON.stringify(block));
    }

    async blockIterator(nowBlock:Block=new Block('',config.godBlockHeight-1)): Promise<AsyncIterable<Block>> {
        if(nowBlock.height===config.godBlockHeight-1) {
            nowBlock = await this.getBlockData(this.getPreGodBlock());
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

    async checkIsTransactionSignInBlock(transactionSign:TransactionSign):Promise<boolean> {
        let isInBlock = false;
        for await (const block of await this.blockIterator()) {
            if(block.isTransactionSignIn(transactionSign)) {
                isInBlock = true;
                break;
            }
        }
        return isInBlock
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