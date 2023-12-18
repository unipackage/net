import { AbstractEvm } from "./abstract"
import {
    EvmType,
    IEVMEngine,
    TransactionReceipt,
    TransactionResponse,
} from "./interface"

/**
 * Represents the Evm class.
 */
export class Evm extends AbstractEvm {
    constructor(engine: IEVMEngine) {
        super(engine)
    }
    /**
     * Retrieves transaction details for a given transaction hash.
     *
     * @param hash - The transaction hash.
     * @returns A Promise resolving to the transaction details or `null` if not found.
     */
    async getTransaction(hash: string): Promise<null | TransactionResponse> {
        switch (this.getEvmType()) {
            case EvmType.Ethers:
                if (!this.getEtherProvider()) {
                    return null
                } else {
                    return this.getEtherProvider()!.getTransaction(hash)
                }
            case EvmType.Web3:
                if (!this.getWeb3()) {
                    return null
                } else {
                    return this.getWeb3()!.eth.getTransaction(hash)
                }
            default:
                return null
        }
    }

    /**
     * Retrieves transaction receipt for a given transaction hash.
     *
     * @param hash - The transaction hash.
     * @returns A Promise resolving to the transaction receipt or `null` if not found.
     */
    async getTransactionReceipt(
        hash: string
    ): Promise<null | TransactionReceipt> {
        switch (this.getEvmType()) {
            case EvmType.Ethers:
                if (!this.getEtherProvider()) {
                    return null
                } else {
                    return this.getEtherProvider()!.getTransactionReceipt(hash)
                }
            case EvmType.Web3:
                if (!this.getWeb3()) {
                    return null
                } else {
                    return this.getWeb3()!.eth.getTransactionReceipt(hash)
                }
            default:
                return null
        }
    }
}
