export default {
    appName:'fitblock',
    initBlockValLen:128,
    minHardBit:2,
    maxHardBit:32,
    incrHardBitTime:600*1000, //unit：ms
    godWalletAdress:'',//  this maybe be version
    selfWalletAdress:'',
    transactionRate:0.001,
    totalCoinNum:2100*1000*1000*1000, //not same as bitcion can split.so number more.
    outBlockCoinNum:1000*1000, //out block coin number
    maxBlockTransactionSize:1000, // more then maxBlockTransactionSize will invalid，client must try again。
}