import StoreBase from '../../types/StoreBase';
export default class Store extends StoreBase {
    getBlockDataKey(blockHash: string): string {
        throw new Error("Method not implemented.");
    }    getBlockData(blockHash: string): import("../../types/BlockBase").default {
        throw new Error("Method not implemented.");
    }
    keepBlockData(Block: import("../../types/BlockBase").default): boolean {
        throw new Error("Method not implemented.");
    }
    getNotTransactionDataKey(transactionSign: import("../../types/TransactionSignBase").default): string {
        throw new Error("Method not implemented.");
    }
    keepNotTransactionData(transactionSign: import("../../types/TransactionSignBase").default): boolean {
        throw new Error("Method not implemented.");
    }
    getAllNotTransactionData(): import("../../types/TransactionSignBase").default[] {
        throw new Error("Method not implemented.");
    }

    
}