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
