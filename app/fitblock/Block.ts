import BlockBase from '../../types/BlockBase';
import TransactionSign from './TransactionSign';
import {createHash} from 'crypto';
import config from './config'
import {getLoggerInstance} from './Logger'
const logger = getLoggerInstance().getLogger()
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

    getNextBlockHashVerify(nextBlock:Block):{originVerify:string,nextVerify:string} {
        const nextBlockHash = nextBlock.genBlockHash();
        const originVerify = this.nextBlockHash.substring(this.nextBlockHash.length-this.nHardBit);
        const nextVerify = nextBlockHash.substring(0, this.nHardBit);
        return {
            originVerify,nextVerify
        }
    }

    getNextBlockValPowValue(nextBlock:Block):bigint {
        let powValue = 0n;
        if(this.blockVal===nextBlock.blockVal) {return powValue;}
        if(this.height+1 !== nextBlock.height) {return powValue;}
        const blockHashVerify =  this.getNextBlockHashVerify(nextBlock);
        for(let i=0;i<blockHashVerify.nextVerify.length;i++) {
            if(blockHashVerify.nextVerify[i]!=blockHashVerify.originVerify[i]) {
                break;
            }
            powValue+=BigInt(i+1)**config.powIndex;
        }
        return powValue;
    }

    verifyNextBlockVal(nextBlock:Block):boolean {
        if(BigInt(`0x${nextBlock.blockVal}`)<BigInt(config.minblockVal)) {
            return false;
        }
        if(this.blockVal===nextBlock.blockVal) {return false;}
        const blockHashVerify =  this.getNextBlockHashVerify(nextBlock);
        if(blockHashVerify.originVerify!==blockHashVerify.nextVerify) {return false;}
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
        if(!this.verifyNextBlockHeight(nextBlock)){
            logger.log(`Height verify failed!`)
            return false;
        }
        if(!this.verifyTransactions(nextBlock)){
            logger.log(`Transactions verify failed!`)
            return false;
        }
        if(!this.verifyNextBlockHash(nextBlock)){
            logger.log(`NextBlockHash verify failed!`)
            return false;
        }
        if(!this.verifyNextBlockNHardBit(nextBlock)){
            logger.log(`HardBit verify failed!`)
            return false;
        }
        if(!this.verifyNextBlockTimestamp(nextBlock)){
            logger.log(`Timestamp verify failed!`)
            return false;
        }
        return true;
    }

    verifyGodBlock(godBlock:Block):boolean {
        if(godBlock.nHardBit !== config.minHardBit) {
            logger.log(`minHardBit verify failed!`)
            return false;
        }
        if(godBlock.workerAddress !== config.godWalletAdress) {
            logger.log(`godWalletAdress verify failed!`)
            return false;
        }
        if(godBlock.height !== config.godBlockHeight) {
            logger.log(`godBlockHeight verify failed!`)
            return false;
        }
        if(godBlock.transactionSigns.length !== 0) {
            logger.log(`transactionSigns verify failed!`)
            return false;
        }
        if(godBlock.blockVal.length !== config.initBlockValLen) {
            logger.log(`initBlockValLen verify failed!`)
            return false;
        }
        if(godBlock.nextBlockHash.length !== 64) {
            logger.log(`nextBlockHash verify failed!`)
            return false;
        }
        if(godBlock.timestamp <= 1578000000000) {
            logger.log(`timestamp verify failed!`)
            return false;
        }
        return true;
    }

    static getPreGodBlock():Block {
        const preGodBlock = new Block('',config.godBlockHeight-1);
        preGodBlock.timestamp = 0;
        preGodBlock.nextBlockHash = config.godBlockHash;
        return preGodBlock;
    }

    static getInvalidBlock():Block {
        const invalidBlock = new Block('',config.godBlockHeight-1);
        return invalidBlock;
    }

    getTransactionsByWalletAdress(walletAdress: string): Array<TransactionSign> {
        const transactions = []
        for(const transactionSign of this.transactionSigns) {
            if(walletAdress===transactionSign.transaction.senderAdress) {
                transactions.push(transactionSign)
            }
            if(walletAdress===transactionSign.transaction.accepterAdress) {
                transactions.push(transactionSign)
            }
        }
        return transactions
    }

    getOutBlockCoinNumber(): number {
        return Math.floor(config.initOutBlockCoinNum/Math.ceil(this.height/config.HalfHeightCycle));
    }

    getMiningCoinNumberyByWalletAdress(walletAdress: string): number {
        let coinNum = 0;
        if(walletAdress===this.workerAddress) {
            coinNum+=this.getOutBlockCoinNumber();
            for(const transactionSign of this.transactionSigns) {
                coinNum+=transactionSign.transaction.getTradingFees();
            }
        }
        return coinNum;
    }
    getCoinNumberyByWalletAdress(walletAdress: string): number {
        let coinNum = 0;
        coinNum+=this.getMiningCoinNumberyByWalletAdress(walletAdress);
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