import StoreBase from '../../types/StoreBase';
import Block from './Block';
export default class Store extends StoreBase {
    getGodKey(): string {
        return `godBlock`;
    }
    getBlockDataKey(blockHash: string): string {
        return `block:${blockHash}`;
    }

    async getBlockData(blockHash:string):Promise<Block> {
        return await this.get(this.getBlockDataKey(blockHash));
    }

    async keepBlockData(blockHash:string, block:Block):Promise<boolean> {
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
}