import BlockBase from '../../types/BlockBase';
import TransactionSign from './transactionSign';
import {createHash} from 'crypto';
import config from './config'
export default class Block extends BlockBase {
    transactionSigns:Array<TransactionSign>;
    constructor (walletAdress, height) {
        super(walletAdress, height);
        this.nHardBit = config.minHardBit;
    }
    
    addTransaction(transactionSign: TransactionSign) {
        this.transactionSigns.push(transactionSign);
    }

    outBlock(nextBlockVal: string): void {
        this.blockVal = nextBlockVal;
        this.nextBlockHash = this.genBlockHash();
        this.timestamp = new Date().getTime();
    }

    getBlockValByBigInt(blockOriginVal: bigint) {
        return blockOriginVal.toString(16);
    }

    genBlockHash():string {
        return createHash('sha256').update(`${JSON.stringify(this.transactionSigns)}|${this.blockVal}|${this.workerAddress}`).digest('hex');
    }

    verifyNextBlockHeight(nextBlock:Block): boolean {
        return nextBlock.height+1 ===this.height;
    }

    verifyTransactions(nextBlock:Block): boolean {
        for(const transactionSign of nextBlock.transactionSigns) {
            if(!transactionSign.verify()){return false;}
        }
        return true;
    }

    verifyNextBlockVal(nextBlock:Block):boolean {
        const nextBlockHash = nextBlock.genBlockHash();
        const originVerify = this.nextBlockHash.substr(-1, this.nHardBit);
        const nextVerify = nextBlockHash.substr(0, this.nHardBit);
        if(originVerify!==nextVerify) {return false;}
        return true;
    }
    verifyNextBlockHash(nextBlock:Block):boolean {
        if(!this.verifyNextBlockVal(nextBlock)){return false;}
        const nextBlockHash = nextBlock.genBlockHash();
        if(nextBlock.nextBlockHash!==nextBlockHash) {return false;}
        return true;
    }
    getNextBlockNHardBit(nextBlock:Block):number {
        let nHardBit;
        if(nextBlock.timestamp-this.timestamp>config.incrHardBitTime) {
            nHardBit = this.nHardBit+1;
        } else {
            nHardBit = this.nHardBit-1;
        }
        if(nHardBit>config.maxHardBit){nHardBit = config.maxHardBit;}
        if(nHardBit<config.minHardBit){nHardBit = config.minHardBit;}
        return nHardBit;
    }
    verifyNextBlockTimestamp(nextBlock:Block):boolean {
        if(nextBlock.timestamp<this.timestamp)  {return false;}
        if(new Date().getTime()<nextBlock.timestamp)  {return false;}
        return 
    }
    verifyNextBlockNHardBit(nextBlock:Block):boolean {
        const nHardBit = this.getNextBlockNHardBit(nextBlock);
        if(nextBlock.nHardBit!==nHardBit) {return false;}
        return true;
    }
    verifyNextBlock(nextBlock:Block):boolean {
        if(!this.verifyNextBlockHeight(nextBlock)){return false;}
        if(!this.verifyTransactions(nextBlock)){return false;}
        if(!this.verifyNextBlockHash(nextBlock)){return false;}
        if(!this.verifyNextBlockTimestamp(nextBlock)){return false;}
        if(!this.verifyNextBlockNHardBit(nextBlock)){return false;}
        return true;
    }

    getCoinNumByWalletAdress(walletAdress: string): number {
        let coinNum = 0;
        if(walletAdress===this.workerAddress) {
            coinNum+=Math.floor(config.initOutBlockCoinNum/Math.ceil(this.height/config.HalfHeightCycle));
            for(const transactionSign of this.transactionSigns) {
                coinNum+=transactionSign.transaction.getTradingFees();
            }
        }
        for(const transactionSign of this.transactionSigns) {
            if(walletAdress===transactionSign.transaction.senderAdress) {
                coinNum-=transactionSign.transaction.transCoinNumber;
            }
            if(walletAdress===transactionSign.transaction.accepterAdress) {
                coinNum+= transactionSign.transaction.getArriveFees();
            }
        }
        return coinNum;
    }
    
}