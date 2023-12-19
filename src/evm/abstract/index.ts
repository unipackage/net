import { ethers } from "ethers"
import { Web3, Numbers } from "web3"
import { EtherUnits } from "web3-utils"
import { Result } from "@unipackage/utils"
import {
    EvmInput,
    EvmOutput,
    EvmTransactionOptions,
    EvmType,
    IEVMEngine,
    IEVM,
    AbiFragment,
    Contract,
    TransactionReceipt,
    TransactionResponse,
    Signature,
    Abi,
    EvmEventArgs,
} from "../interface"
import { IWallet } from "../interface/wallet"
/**
 * Represents the Ethereum Virtual Machine (EVM) Engine interface.
 */
export abstract class AbstractEvm implements IEVM {
    private engine: IEVMEngine

    constructor(engine: IEVMEngine) {
        this.engine = engine
    }

    /**
     * Call a function on the EVM contract.
     *
     * @param input - The input parameters for the function call.
     * @returns A promise that resolves to the output of the function call.
     */
    async call(input: EvmInput): Promise<EvmOutput<any>> {
        return await this.engine.call(input)
    }

    /**
     * Decode the transaction input on the EVM.
     *
     * @param txInput - The transaction input data.
     * @returns A promise that resolves to the decoded output.
     */
    decodeTxInputToEvmInput(txInput: string): EvmOutput<EvmInput> {
        return this.engine.decodeTxInputToEvmInput(txInput)
    }

    /**
     * Encode EVM input to transaction input data.
     *
     * @param input - The input parameters for the EVM operation.
     * @returns A promise that resolves to the encoded transaction input.
     */
    encodeEvmInputToTxinput(input: EvmInput): EvmOutput<string> {
        return this.engine.encodeEvmInputToTxinput(input)
    }

    /**
     * Encode function signature using the ABI.
     *
     * @param abi - The ABI function fragment.
     * @returns The encoded function signature or an error result.
     */
    encodeFunctionSignatureByAbi(abiFragment: AbiFragment): Result<string> {
        return this.engine.encodeFunctionSignatureByAbi(abiFragment)
    }

    /**
     * Encode function signature using the function name.
     *
     * @param name - The name of the function.
     * @returns A promise that resolves to the encoded function signature or an error result.
     */
    encodeFunctionSignatureByFuntionName(name: string): EvmOutput<string> {
        return this.engine.encodeFunctionSignatureByFuntionName(name)
    }

    /**
     * Generates a value in Wei based on the provided number and unit.
     *
     * @param number - The number to convert to Wei.
     * @param unit - The unit to convert the number to (e.g., Ether, Gwei).
     * @returns The generated value in Wei as a string or bigint.
     */
    generateWei(number: Numbers, unit: EtherUnits): string | bigint {
        return this.engine.generateWei(number, unit)
    }

    getWallet(): IWallet {
        return this.engine.getWallet()
    }

    /**
     * Get the EVM contract.
     *
     * @returns The EVM contract object or null if not initialized.
     */
    getContract(): Contract | null {
        return this.engine.getContract()
    }

    /**
     * Get the EVM contract address.
     *
     * @returns The EVM contract address or null if not initialized.
     */
    getContractAddress(): string {
        return this.engine.getContractAddress()
    }

    /**
     * Get the EVM contract abi.
     *
     * @returns The EVM contract abi or null if not initialized.
     */
    getContractABI(): Abi {
        return this.engine.getContractABI()
    }

    /**
     * Extracts Ethereum Virtual Machine (EVM) event arguments from a transaction receipt.
     *
     * @param transactionReceipt - The transaction receipt containing event data.
     * @param name - The name of the event.
     * @returns An object representing the extracted EVM event arguments.
     */
    getEvmEventArgs(
        transactionReceipt: TransactionReceipt,
        name: string
    ): EvmOutput<EvmEventArgs> {
        return this.engine.getEvmEventArgs(transactionReceipt, name)
    }

    /**
     * Get the EVM type.
     *
     * @returns The EVM type,Web3 or Ethers.
     */
    getEvmType(): EvmType {
        return this.engine.getEvmType()
    }

    /**
     * Get the EVM provider url.
     *
     * @returns The EVM provider url or undefined not initialized.
     */
    getProviderUrl(): string | undefined {
        return this.engine.getProviderUrl()
    }

    /**
     * Get the Ether Provider
     *
     * @returns Ether Provider object or null if not initialized.
     */
    getEtherProvider(): ethers.AbstractProvider | null {
        return this.engine.getEtherProvider()
    }

    /**
     * Get the Web3 object.
     *
     * @returns The Web3 object or null if not initialized.
     */
    getWeb3(): Web3 | null {
        return this.engine.getWeb3()
    }

    /**
     * Send a transaction to the EVM contract.
     *
     * @param input - The input parameters for the transaction.
     * @param options - The transaction options.
     * @returns A promise that resolves to the transaction result.
     */
    async send(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<TransactionReceipt>> {
        return await this.engine.send(input, options)
    }

    /**
     * Send a signed transaction to the EVM.
     *
     * @param signed - The signed transaction data.
     * @returns A promise that resolves to the transaction result.
     */
    async sendSigned(
        signed: Signature
    ): Promise<EvmOutput<TransactionReceipt>> {
        return await this.engine.sendSigned(signed)
    }

    /**
     * Sign a transaction on the EVM.
     *
     * @param input - The input parameters for the transaction.
     * @param options - The transaction options.
     * @returns A promise that resolves to the signed transaction or an error result.
     */
    async sign(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<Signature>> {
        return await this.engine.sign(input, options)
    }

    /**
     * Retrieves transaction details for a given transaction hash.
     *
     * @param hash - The transaction hash.
     * @returns A Promise resolving to the transaction details or `null` if not found.
     */
    abstract getTransaction(hash: string): Promise<TransactionResponse | null>

    /**
     * Retrieves transaction receipt for a given transaction hash.
     *
     * @param hash - The transaction hash.
     * @returns A Promise resolving to the transaction receipt or `null` if not found.
     */
    abstract getTransactionReceipt(
        hash: string
    ): Promise<TransactionReceipt | null>
}
