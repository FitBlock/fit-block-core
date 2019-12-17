import BlockBase from './BlockBase'
export default abstract class MiningWorkerBase {
    abstract mining(preBlock:BlockBase):Promise<BlockBase>;
    abstract addTransactionInBlock(newBlock: BlockBase): Promise<BlockBase>;
}