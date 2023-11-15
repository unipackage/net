import { Result } from "@unipackage/utils"
import { InputParams } from "../../shared/types/params"
import { Transaction as Web3Transaction } from "web3"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import {
    TransactionRequest as EtherTransaction,
    Signature as EtherSignature,
} from "ethers"

export interface EvmInput extends InputParams {}

export interface EvmOutput<T> extends Result<T> {}

export interface EvmTransactionOptions {
    web3Transaction?: Web3Transaction
    etherTransaction?: EtherTransaction
    confirmations?: number
}

export interface EvmListenerOptions {
    eventName?: string
    eventAddress?: string
    fromBlock?: number
    toBlock?: number
}

export interface IEVM {
    call(input: EvmInput): Promise<EvmOutput<any>>

    sendTransaction(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<any>>

    signTransactionByPrivateKey(
        input: EvmInput,
        options: EvmTransactionOptions,
        privateKey?: string
    ): Promise<Result<Web3Signature | EtherSignature>>

    sendSignedTransaction(
        signedTransaction: Web3Signature | EtherSignature
    ): Promise<EvmOutput<any>>

    signByPrivateKeyAndSendSignedTransaction(
        input: EvmInput,
        options: EvmTransactionOptions,
        privateKey?: string
    ): Promise<EvmOutput<any>>

    listen(
        callback: (event: any) => void,
        options: EvmListenerOptions
    ): () => void
}
