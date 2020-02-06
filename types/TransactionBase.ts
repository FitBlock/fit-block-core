export default abstract class TransactionBase {
    timestamp:number;
    senderAdress:string;
    accepterAdress:string;
    transCoinNumber:number;
    constructor(senderAdress:string,accepterAdress:string,transCoinNumber:number) {
        this.senderAdress = senderAdress;
        this.accepterAdress = accepterAdress;
        this.transCoinNumber = transCoinNumber;
        this.timestamp = new Date().getTime();
    }
    abstract getArriveFees():number;
    abstract getTradingFees():number;
    abstract isTimeOut():boolean;
    abstract isSame(transaction:TransactionBase):boolean;
    serialize() {
        return JSON.stringify({
            timestamp:this.timestamp,
            senderAdress:this.senderAdress,
            accepterAdress:this.accepterAdress,
            transCoinNumber:this.transCoinNumber,
        });
    }
}