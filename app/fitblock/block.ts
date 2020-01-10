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
    
    isTransactionSignIn(transactionSign:TransactionSign) {
        let isInBlock = false;
        for(const blockTransactionSign of this.transactionSigns) {
            if(blockTransactionSign.isSame(transactionSign)) {
                isInBlock = true;
                break;
            }
        }
        return isInBlock;
    }

    isSame(block:Block): boolean {
        if(this.serialize()!==block.serialize()){return false;}
        return true;
    }

    static createByData(blockData:any): Block {
        const newBlock = new Block(blockData.workerAddress,blockData.height)
        for(let i=0;i<blockData.transactionSigns.length;i++) {
            blockData.transactionSigns[i] = TransactionSign.createByData(blockData.transactionSigns[i])
        }
        Object.assign(newBlock, blockData);
        return newBlock;
    }

    outBlock(newBlock: Block): Block {
        newBlock.nextBlockHash = newBlock.genBlockHash();
        newBlock.timestamp = new Date().getTime();
        if(newBlock.height>config.godBlockHeight) {
            newBlock.nHardBit = this.getNextBlockNHardBit(newBlock)
        }
        return newBlock;
    }

    getBlockValByBigInt(blockOriginVal: bigint) {
        return blockOriginVal.toString(config.blockValRadix);
    }

    genBlockHash():string {
        return createHash('sha256').update(`${JSON.stringify(this.transactionSigns)}|${this.blockVal}|${this.workerAddress}`).digest('hex');
    }

    verifyNextBlockHeight(nextBlock:Block): boolean {
        return nextBlock.height ===this.height+1;
    }

    verifyTransactions(nextBlock:Block): boolean {
        for(const transactionSign of nextBlock.transactionSigns) {
            if(!transactionSign.verify()){return false;}
        }
        return true;
    }

    verifyNextBlockVal(nextBlock:Block):boolean {
        if(BigInt(`0x${nextBlock.blockVal}`)<BigInt(config.minblockVal)) {
            return false;
        }
        const nextBlockHash = nextBlock.genBlockHash();
        const originVerify = this.nextBlockHash.substring(this.nextBlockHash.length-this.nHardBit);
        const nextVerify = nextBlockHash.substring(0, this.nHardBit);
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
        if(nextBlock.timestamp-this.timestamp<config.incrHardBitTime) {
            nHardBit = this.nHardBit+1;
        } else {
            nHardBit = this.nHardBit-1;
        }
        if(nHardBit>config.maxHardBit){nHardBit = config.maxHardBit;}
        if(nHardBit<config.minHardBit){nHardBit = config.minHardBit;}
        return nHardBit;
    }
    verifyNextBlockTimestamp(nextBlock:Block):boolean {
        if(nextBlock.timestamp<=this.timestamp)  {return false;}
        if(new Date().getTime()<nextBlock.timestamp)  {return false;}
        return true;
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
        if(!this.verifyNextBlockNHardBit(nextBlock)){return false;}
        if(!this.verifyNextBlockTimestamp(nextBlock)){return false;}
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