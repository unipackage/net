/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under either the MIT License (the "MIT License") or the Apache License, Version 2.0
 *  (the "Apache License"). You may not use this file except in compliance with one of these
 *  licenses. You may obtain a copy of the MIT License at
 *
 *      https://opensource.org/licenses/MIT
 *
 *  Or the Apache License, Version 2.0 at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the MIT License or the Apache License for the specific language governing permissions and
 *  limitations under the respective licenses.
 ********************************************************************************/

import { Result } from "@unipackage/utils"
import { InputParams } from "../../shared/types/params"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import {
    Contract as Web3Contract,
    Web3,
    AbiFunctionFragment,
    Numbers,
    TransactionInfo as Web3TransactionResponse,
    TransactionReceipt as Web3TransactionReceipt,
} from "web3"
import { EtherUnits } from "web3-utils"
import {
    ethers,
    JsonFragment,
    Contract as EtherContract,
    TransactionResponse as EthersTransactionResponse,
    TransactionReceipt as EthersTransactionReceipt,
} from "ethers"

export type TransactionResponse =
    | EthersTransactionResponse
    | Web3TransactionResponse

export type TransactionReceipt =
    | EthersTransactionReceipt
    | Web3TransactionReceipt

export type Signature = Web3Signature | string

export type Contract = Web3Contract<AbiFunctionFragment[]> | EtherContract

export type AbiFragment = AbiFunctionFragment | JsonFragment

export type Abi = AbiFragment[]

export type EvmEventArgs = any[]

/**
 * Default transaction options for EVM transactions.
 */
export const defaultTransactionOptions: EvmTransactionOptions = {
    confirmations: 0,
}

export enum EvmType {
    Web3,
    Ethers,
}

/**
 * Represents the input for an EVM operation.
 */
export interface EvmInput extends InputParams {}

/**
 * Represents the output of an EVM operation.
 */
export interface EvmOutput<T> extends Result<T> {}

/**
 * Represents the options for an EVM transaction.
 */
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

/**
 * Represents the Ethereum Virtual Machine (EVM) Engine interface.
 */
export interface IEVMEngine {
    /**
     * Call a function on the EVM contract.
     *
     * @param input - The input parameters for the function call.
     * @returns A promise that resolves to the output of the function call.
     */
    call(input: EvmInput): Promise<EvmOutput<any>>

    /**
     * Decode the transaction input on the EVM.
     *
     * @param txInput - The transaction input data.
     * @returns A promise that resolves to the decoded output.
     */
    decodeTxInputToEvmInput(txInput: string): EvmOutput<EvmInput>

    /**
     * Encode EVM input to transaction input data.
     *
     * @param input - The input parameters for the EVM operation.
     * @returns A promise that resolves to the encoded transaction input.
     */
    encodeEvmInputToTxinput(input: EvmInput): EvmOutput<string>

    /**
     * Encode function signature using the ABI.
     *
     * @param abi - The ABI function fragment.
     * @returns The encoded function signature or an error result.
     */
    encodeFunctionSignatureByAbi(abiFragment: AbiFragment): Result<string>

    /**
     * Encode function signature using the function name.
     *
     * @param name - The name of the function.
     * @returns A promise that resolves to the encoded function signature or an error result.
     */
    encodeFunctionSignatureByFuntionName(name: string): EvmOutput<string>

    /**
     * Generates a value in Wei based on the provided number and unit.
     *
     * @param number - The number to convert to Wei.
     * @param unit - The unit to convert the number to (e.g., Ether, Gwei).
     * @returns The generated value in Wei as a string or bigint.
     */
    generateWei(number: Numbers, unit: EtherUnits): string | bigint

    /**
     * Get the EVM contract.
     *
     * @returns The EVM contract object or null if not initialized.
     */
    getContract(): Contract | null

    /**
     * Get the EVM contract address.
     *
     * @returns The EVM contract address or null if not initialized.
     */
    getContractAddress(): string

    /**
     * Get the EVM contract abi.
     *
     * @returns The EVM contract abi or null if not initialized.
     */
    getContractABI(): Abi

    getEvmEventArgs(
        transactionReceipt: TransactionReceipt,
        name: string
    ): EvmOutput<EvmEventArgs>

    /**
     * Get the EVM type.
     *
     * @returns The EVM type,Web3 or Ethers.
     */
    getEvmType(): EvmType

    /**
     * Get the EVM provider url.
     *
     * @returns The EVM provider url or undefined not initialized.
     */
    getProviderUrl(): string | undefined

    /**
     * Get the Ether Provider
     *
     * @returns Ether Provider object or null if not initialized.
     */
    getEtherProvider(): ethers.AbstractProvider | null

    /**
     * Get the Web3 object.
     *
     * @returns The Web3 object or null if not initialized.
     */
    getWeb3(): Web3 | null

    /**
     * Send a transaction to the EVM contract.
     *
     * @param input - The input parameters for the transaction.
     * @param options - The transaction options.
     * @returns A promise that resolves to the transaction result.
     */
    send(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<TransactionReceipt>>

    /**
     * Send a signed transaction to the EVM.
     *
     * @param signed - The signed transaction data.
     * @returns A promise that resolves to the transaction result.
     */
    sendSigned(signed: Signature): Promise<EvmOutput<TransactionReceipt>>

    /**
     * Sign a transaction on the EVM.
     *
     * @param input - The input parameters for the transaction.
     * @param options - The transaction options.
     * @returns A promise that resolves to the signed transaction or an error result.
     */
    sign(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<Signature>>
}

/**
 * Represents the Ethereum Virtual Machine (EVM) interface.
 */
export interface IEVM extends IEVMEngine {
    getTransaction(hash: string): Promise<null | TransactionResponse>

    getTransactionReceipt(hash: string): Promise<null | TransactionReceipt>
}

/**
 * Check if an object is of type EvmTransactionOptions.
 *
 * @param obj - The object to check.
 * @returns True if the object is of type EvmTransactionOptions, false otherwise.
 */
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
