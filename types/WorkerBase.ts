import BlockBase from './BlockBase'
export default abstract class WorkerBase {
    abstract mining(preBlock:BlockBase):BlockBase;
    abstract verifyNextBlockHash(preBlock:BlockBase, nextBlockVal:string):boolean;
}