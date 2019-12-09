export default abstract class TransactionBase {
    timestamp:Number;
    senderAdress:string;
    accepterAdress:string;
    transCoinNumber:Number;
    constructor(senderAdress:string,accepterAdress:string,transCoinNumber:Number) {
        this.senderAdress = senderAdress;
        this.accepterAdress = accepterAdress;
        this.transCoinNumber = transCoinNumber;
        this.timestamp = new Date().getTime();
    }

    serialize() {
        return JSON.stringify({
            timestamp:this.timestamp,
            senderAdress:this.senderAdress,
            accepterAdress:this.accepterAdress,
            transCoinNumber:this.transCoinNumber,
        });
    }
}