import BlockBase from './BlockBase'
export default abstract class MiningWorkerBase {
    abstract mining(preBlock:BlockBase, miningAddress:string, range: Array<bigint>):Promise<BlockBase>;
    abstract addTransactionInBlock(nextBlockHash:string ,newBlock: BlockBase): Promise<BlockBase>;
}