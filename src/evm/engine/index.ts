import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { Signature as EtherSignature } from "ethers"
import { Result } from "@unipackage/utils"
import {
    IEVM,
    EvmInput,
    EvmOutput,
    EvmTransactionOptions,
    EvmListenerOptions,
} from "../interface"

export abstract class EvmEngine implements IEVM {
    //future some common method add here
    abstract call<T>(input: EvmInput): Promise<EvmOutput<T>>

    abstract sendTransaction<T>(
        input: EvmInput,
        options?: EvmTransactionOptions
    ): Promise<EvmOutput<T>>

    abstract signTransaction(
        input: EvmInput,
        options: EvmTransactionOptions,
        privateKey?: string
    ): Promise<Result<Web3Signature | EtherSignature>>

    abstract sendSignedTransaction(
        signedTransaction: Web3Signature | EtherSignature
    ): Promise<EvmOutput<any>>

    abstract signAndSendSignedTransaction(
        input: EvmInput,
        options: EvmTransactionOptions,
        privateKey?: string
    ): Promise<EvmOutput<any>>

    abstract listen(
        callback: (event: any) => void,
        options: EvmListenerOptions
    ): () => void
}

export const DefaultTransactionOptions: EvmTransactionOptions = {
    confirmations: 0,
}
