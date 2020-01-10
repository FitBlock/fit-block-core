import BlockBase from './BlockBase'
export default abstract class MiningWorkerBase {
    abstract mining(preBlock:BlockBase):Promise<BlockBase>;
    abstract addTransactionInBlock(nextBlockHash:string ,newBlock: BlockBase): Promise<BlockBase>;
}