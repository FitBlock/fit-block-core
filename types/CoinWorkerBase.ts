import BlockBase from './BlockBase'
import TransactionSignBase from './TransactionSignBase';
export default abstract class MiningWorkerBase {
    abstract mining(
        preBlock:BlockBase, 
        miningAddress:string, 
        transactionSignList:Array<TransactionSignBase>,
        miningAop:(nextBlock: BlockBase, isComplete:boolean)=>Promise<boolean>,
        startBigInt:bigint):Promise<BlockBase>;
    abstract addTransactionInBlock(
        transactionSignList:Array<TransactionSignBase>,
        nextBlockHash:string ,
        newBlock: BlockBase): Promise<BlockBase>;
}