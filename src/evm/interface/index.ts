import { Result } from "@unipackage/utils"
import { InputParams } from "../../shared/types/params"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { Signature as EtherSignature } from "ethers"
import { Web3 } from "web3"

export interface EvmInput extends InputParams {}

export interface EvmDecodeOutPut {
    method: string
    params?: any
}

export interface EvmOutput<T> extends Result<T> {}

export interface EvmTransactionOptions {
    from?: string
    to?: string
    value?: number | bigint | string
    gas?: number
    maxFeePerGas?: number
    maxPriorityFeePerGas?: number
    gasPrice?: number
    gasLimit?: number
    nonce?: number
    data?: string
    type?: number
    input?: string
    chainId?: number
    networkId?: number
    confirmations?: number
    privateKey?: string
}

export function isEvmTransactionOptions(obj: any): boolean {
    return (
        typeof obj === "object" &&
        (typeof obj.from === "undefined" || typeof obj.from === "string") &&
        (typeof obj.to === "undefined" || typeof obj.to === "string") &&
        (typeof obj.value === "undefined" ||
            typeof obj.value === "number" ||
            typeof obj.value === "string" ||
            typeof obj.value === "bigint") &&
        (typeof obj.gas === "undefined" || typeof obj.gas === "number") &&
        (typeof obj.maxFeePerGas === "undefined" ||
            typeof obj.maxFeePerGas === "number") &&
        (typeof obj.maxPriorityFeePerGas === "undefined" ||
            typeof obj.maxPriorityFeePerGas === "number") &&
        (typeof obj.gasPrice === "undefined" ||
            typeof obj.gasPrice === "number") &&
        (typeof obj.gasLimit === "undefined" ||
            typeof obj.gasLimit === "number") &&
        (typeof obj.nonce === "undefined" || typeof obj.nonce === "number") &&
        (typeof obj.data === "undefined" || typeof obj.data === "string") &&
        (typeof obj.type === "undefined" || typeof obj.type === "number") &&
        (typeof obj.input === "undefined" || typeof obj.input === "string") &&
        (typeof obj.chainId === "undefined" ||
            typeof obj.chainId === "number") &&
        (typeof obj.networkId === "undefined" ||
            typeof obj.networkId === "number") &&
        (typeof obj.confirmations === "undefined" ||
            typeof obj.confirmations === "number") &&
        (typeof obj.privateKey === "undefined" ||
            typeof obj.privateKey === "string")
    )
}

export interface IEVM {
    call(input: EvmInput): Promise<EvmOutput<any>>

    send(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<any>>

    sign(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<Web3Signature | EtherSignature>>

    sendSigned(signed: Web3Signature | EtherSignature): Promise<EvmOutput<any>>

    getWeb3Object(): Web3 | null
    decodeTxInput(txInput: string): EvmOutput<EvmDecodeOutPut>
}
