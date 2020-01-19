import BlockBase from './BlockBase'
export default abstract class MiningWorkerBase {
    abstract mining(preBlock:BlockBase, range: Array<bigint>):Promise<BlockBase>;
    abstract addTransactionInBlock(nextBlockHash:string ,newBlock: BlockBase): Promise<BlockBase>;
}