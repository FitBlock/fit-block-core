export default {
    appName:'fitblock',
    initBlockValLen:64,
    blockValRadix:16,
    minblockVal:1,
    minHardBit:2,
    maxHardBit:32,
    incrHardBitTime:600*1000, //unit：ms
    godWalletAdress:'SH8ZKQQ8NMwNt2i2GKdPRGjnpZdDXEfFf5foCJmfwtcp7jeMYSMw3eM4mueZdYjKgPyVu8S9tVL76UPLSNgdEbgc',//  this maybe be version
    godBlockHash:'godBlock',
    godBlockHeight:1,
    blockVersionKey:'blockVersion',
    selfWalletAdress:'',
    transactionRate:0.001,
    transactionTimeOutTime:600*1000, //unit：ms
    HalfHeightCycle:77760, // every (18*30*24*60/10) height to helf
    initOutBlockCoinNum:100*1000*1000, //out block coin number
    maxBlockTransactionSize:1000, // more then maxBlockTransactionSize will invalid，client must try again。
    powIndex:16n
}