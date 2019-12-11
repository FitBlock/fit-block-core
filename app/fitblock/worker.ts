import WorkerBase from '../../types/WorkerBase';
import {createHash} from 'crypto';
import Block from './Block';
import config from './config'
export default class Worker extends WorkerBase {
    mining(nowBlock: Block): Block {
        const blockValBuf = Buffer.allocUnsafe(config.blockValLen);
        let startBigInt = 0n;
        let nextBlockHash;
        do {
            blockValBuf.writeBigInt64BE(startBigInt);
            nextBlockHash =  createHash('sha256').update(blockValBuf.toString('hex')).digest('hex');
        } while(!(this.verifyNextBlockHash(nowBlock, nextBlockHash)));
        
    }

    verifyNextBlockHash(nowBlock:Block, nextBlockHash:string):boolean {
        const originVerify = nowBlock.nextBlockHash.substr(-1, nowBlock.nHardBit);
        const nextVerify = nextBlockHash.substr(0, nowBlock.nHardBit);
        if(originVerify==nextVerify) {
            return true;
        }
        return false;
    }
    
}