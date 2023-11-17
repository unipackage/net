import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { Signature as EtherSignature } from "ethers"
import { Result } from "@unipackage/utils"
import { IEVM, EvmInput, EvmOutput, EvmTransactionOptions } from "../interface"
import Web3 from "web3"

export abstract class EvmEngine implements IEVM {
    //future some common method add here
    abstract call<T>(input: EvmInput): Promise<EvmOutput<T>>

    abstract send<T>(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<T>>

    abstract sign(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<Result<Web3Signature | EtherSignature>>

    abstract sendSigned<T>(
        signedTransaction: Web3Signature | EtherSignature
    ): Promise<EvmOutput<T>>

    abstract getWeb3Object(): Web3 | null
    abstract decodeTxInput(txInput: string): EvmOutput<any>
}

export const DefaultTransactionOptions: EvmTransactionOptions = {
    confirmations: 0,
}
