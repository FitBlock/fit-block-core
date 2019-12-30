export default {
    appName:'fitblock',
    initBlockValLen:128,
    minHardBit:2,
    maxHardBit:32,
    incrHardBitTime:600*1000, //unit：ms
    godWalletAdress:'',//  this maybe be version
    selfWalletAdress:'',
    transactionRate:0.001,
    HalfHeightCycle:77760, // every (18*30*24*60/10) height to helf
    initOutBlockCoinNum:100*1000*1000, //out block coin number
    maxBlockTransactionSize:1000, // more then maxBlockTransactionSize will invalid，client must try again。
}