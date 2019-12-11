import BlockBase from './BlockBase'
export default abstract class WorkerBase {
    abstract mining(nowBlock:BlockBase):BlockBase;
    abstract verifyNextBlockHash(nowBlock:BlockBase):boolean;
}