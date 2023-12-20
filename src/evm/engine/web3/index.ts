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

import {
    Web3,
    Transaction as Web3Transaction,
    TransactionReceipt,
    AbiFunctionFragment,
    AbiInput,
    Numbers,
    AbiParameter,
} from "web3"
import { EtherUnits } from "web3-utils"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { Result } from "@unipackage/utils"
import type { Contract } from "web3-eth-contract"
import {
    EvmEventArgs,
    EvmInput,
    EvmOutput,
    EvmTransactionOptions,
    EvmType,
    IEVMEngine,
} from "../../interface"
import { defaultTransactionOptions } from "../../interface"
import {
    convertArrayToObjectByAbiAndName,
    getAbiFragmentByMethodName,
    getEncodedParamsFromTxinput,
    getFunctionSignatureFromTxinput,
    parseEvmReplyData,
    getFromAddress,
    getFromPrivateKey,
} from "../utils"
import { IWallet } from "../../interface/wallet"

/**
 * Define ethereum as an optional property.
 */
declare global {
    interface Window {
        ethereum?: any
    }
}

/**
 * Class representing a Web3Evm instance.
 */
export class Web3EvmEngine implements IEVMEngine {
    private web3Object: Web3 | null = null
    private contractObject: Contract<AbiFunctionFragment[]> | undefined
    private contractAddress: string
    private contractABI: AbiFunctionFragment[]
    private providerUrl: string | undefined = undefined
    public wallet: IWallet | undefined

    /**
     * Constructor for Web3Evm class.
     *
     * @TODO test window.ethereum
     * @param contractABI - The contract's ABI.
     * @param contractAddress - The contract's address.
     * @param providerUrl - The provider URL.
     */
    constructor(
        contractABI: AbiFunctionFragment[],
        contractAddress: string,
        providerUrl?: string,
        wallet?: IWallet
    ) {
        this.contractAddress = contractAddress
        this.contractABI = contractABI
        this.providerUrl = providerUrl
        this.wallet = wallet

        if (!providerUrl) {
            try {
                if (typeof window !== "undefined" && window.ethereum) {
                    this.web3Object = new Web3(window.ethereum)
                    window.ethereum.enable().then(() => {
                        this.initContract(contractABI, contractAddress)
                    })
                } else {
                    throw new Error("window is unnormal!")
                }
            } catch (error) {
                console.error("Error enabling window ethereum accounts:", error)
            }
        } else {
            this.web3Object = new Web3(providerUrl)
            this.initContract(contractABI, contractAddress)
        }
    }

    /**
     * Generates a value in Wei based on the provided number and unit.
     *
     * @param number - The number to convert to Wei.
     * @param unit - The unit to convert the number to (e.g., Ether, Gwei).
     * @returns The generated value in Wei as a string or bigint.
     */
    generateWei(number: Numbers, unit: EtherUnits): string {
        if (!this.web3Object) {
            throw new Error("web3 is not initialized!")
        }
        return this.web3Object.utils.toWei(number, unit)
    }

    /**
     * Generates a transaction based on input and options.
     *
     * @param input - The EVM input.
     * @param options - The transaction options.
     * @returns A promise resolving to EvmOutput object with the transaction.
     */
    private async generateTransaction(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<Web3Transaction>> {
        if (!this.web3Object || !this.contractObject) {
            return {
                ok: false,
                error: "Web3 or contract is not initialized!",
            }
        }

        const from = getFromAddress(this.wallet as IWallet, options)
        if (!from) {
            return {
                ok: false,
                error: "generateTransaction missing param: [from]",
            }
        }

        try {
            const nonce = await this.web3Object.eth.getTransactionCount(from)

            const dataResult = this.encodeEvmInputToTxinput(input)
            if (!dataResult.ok) {
                return {
                    ok: false,
                    error: dataResult.error,
                }
            }

            const txOriginObject: Web3Transaction = {
                ...defaultTransactionOptions,
                from,
                to: this.contractAddress,
                nonce: nonce,
                ...options,
                data: dataResult.data,
            }
            const gas = await this.web3Object.eth.estimateGas(txOriginObject)
            const gasPrice = Number(await this.web3Object.eth.getGasPrice())
            const maxPriorityFeePerGas = gasPrice * 1
            const maxFeePerGas = gasPrice * 2 + maxPriorityFeePerGas

            const txObject = {
                ...txOriginObject,
                gas,
                maxFeePerGas,
                maxPriorityFeePerGas,
            }

            return { ok: true, data: txObject }
        } catch (error) {
            return {
                ok: false,
                error: `generateTransaction error: ${error}`,
            }
        }
    }

    /**
     * Initializes the contract.
     *
     * @param contractABI - The contract's ABI.
     * @param contractAddress - The contract's address.
     * @returns EvmOutput object indicating success or failure.
     */
    private initContract(
        contractABI: AbiFunctionFragment[],
        contractAddress: string
    ): EvmOutput<void> {
        if (!this.web3Object) {
            return {
                ok: false,
                error: "Web3 is not initialized!",
            }
        }

        this.contractObject = new this.web3Object.eth.Contract(
            contractABI,
            contractAddress,
            {
                dataInputFill: "data",
            }
        )
        return { ok: true }
    }

    /**
     * Calls a contract function.
     *
     * @param input - The EVM input.
     * @returns A promise resolving to EvmOutput object with the result of the contract call.
     */
    async call(input: EvmInput): Promise<EvmOutput<any>> {
        if (!this.web3Object || !this.contractObject) {
            return {
                ok: false,
                error: "Web3 or contract is not initialized!",
            }
        }

        try {
            const params: any[] = input.params || []
            const originResult = await this.contractObject.methods[
                input.method
            ](
                //@ts-ignore
                ...params
            ).call()
            const result = parseEvmReplyData(originResult!)

            return {
                ok: true,
                data:
                    result instanceof Array
                        ? convertArrayToObjectByAbiAndName(
                              this.contractABI,
                              "function",
                              input.method,
                              result
                          )
                        : result,
            }
        } catch (error) {
            return {
                ok: false,
                error: `Call contract error: ${error}`,
            }
        }
    }

    /**
     * Decodes transaction input.
     *
     * @param txInput - The transaction input.
     * @returns A promise resolving to EvmOutput object with the decoded transaction input.
     */
    decodeTxInputToEvmInput(txInput: string): EvmOutput<EvmInput> {
        if (!this.web3Object) {
            return {
                ok: false,
                error: "Web3 is not initialized!",
            }
        }

        try {
            const matchingFunction = this.contractABI.find((abi) => {
                const functionSignatureFromAbi =
                    this.encodeFunctionSignatureByAbi(abi)
                const functionSignatureFromTxinput =
                    getFunctionSignatureFromTxinput(txInput)

                if (
                    functionSignatureFromAbi.ok &&
                    functionSignatureFromTxinput.ok
                ) {
                    return (
                        functionSignatureFromAbi.data ===
                        functionSignatureFromTxinput.data
                    )
                }
            })

            if (!matchingFunction) {
                return {
                    ok: false,
                    error: "Not found function in ABI!",
                }
            }

            const encodedParams = getEncodedParamsFromTxinput(txInput)
            if (!encodedParams.ok || !encodedParams.data) {
                return {
                    ok: false,
                    error: "getEncodedParamsFromTxinput Error",
                }
            }
            const decodedParams = this.web3Object.eth.abi.decodeParameters(
                matchingFunction.inputs as AbiInput[],
                encodedParams.data
            )
            if (!decodedParams) {
                return {
                    ok: false,
                    error: "Decode params error!",
                }
            }

            return {
                ok: true,
                data: {
                    method: matchingFunction.name,
                    params: parseEvmReplyData(decodedParams),
                },
            }
        } catch (error) {
            console.log(error)
            return {
                ok: false,
                error: `Decode transaction input error: ${error}!`,
            }
        }
    }

    /**
     * Encodes EVM input to transaction input.
     *
     * @param input - The EVM input.
     * @returns Result object with the encoded transaction input.
     */
    encodeEvmInputToTxinput(input: EvmInput): Result<string> {
        const params: any[] = input.params || []
        if (!this.contractObject) {
            return {
                ok: false,
                error: "Contract is not initialized!",
            }
        }

        try {
            return {
                ok: true,
                data: this.contractObject.methods[input.method](
                    //@ts-ignore
                    ...params
                ).encodeABI(),
            }
        } catch (error) {
            return {
                ok: false,
                error: `Encode EVM input to transaction input error: ${error}`,
            }
        }
    }

    /* Encodes ABI to function signature.
     *
     * @param web3 - The Web3 instance.
     * @param abi - The ABI function fragment.
     * @returns Result object with the encoded function signature.
     */
    encodeFunctionSignatureByAbi(abi: AbiFunctionFragment): Result<string> {
        if (!this.web3Object) {
            return {
                ok: false,
                error: "Web3 is not initialized!",
            }
        }

        try {
            if (abi.type === "function") {
                const signature =
                    this.web3Object.eth.abi.encodeFunctionSignature(abi)
                return {
                    ok: true,
                    data: signature,
                }
            } else {
                throw new Error("Provided ABI is not a function ABI!")
            }
        } catch (error) {
            return {
                ok: false,
                error: error,
            }
        }
    }

    /**
     * Encodes function signature.
     *
     * @param name - The name of the function.
     * @returns Result object with the encoded function signature.
     */
    encodeFunctionSignatureByFuntionName(name: string): Result<string> {
        if (!this.web3Object) {
            return {
                ok: false,
                error: "Web3 is not initialized!",
            }
        }
        const abi = getAbiFragmentByMethodName(
            this.contractABI,
            "function",
            name
        )
        if (abi) {
            return this.encodeFunctionSignatureByAbi(abi as AbiFunctionFragment)
        } else {
            return {
                ok: false,
                error: "Function does not exist!",
            }
        }
    }

    /**
     * Retrieve the wallet instance.
     *
     * This method returns the instance of the wallet that implements the IWallet interface.
     * Clients can use this method to access and manage the wallet's functionalities.
     *
     * @returns An instance of the wallet implementing the IWallet interface.
     */
    getWallet(): IWallet {
        return this.wallet as IWallet
    }
    /**
     * Contract getter.
     *
     * @NOTE check contract not null when using in window.ethereum
     * @returns Contract instance or null.
     */
    getContract(): Contract<AbiFunctionFragment[]> | null {
        if (this.contractObject) {
            return this.contractObject
        } else {
            return null
        }
    }

    /**
     * Get the EVM contract address.
     *
     * @returns The EVM contract address or null if not initialized.
     */
    getContractAddress(): string {
        return this.contractAddress
    }

    /**
     * Get the EVM contract abi.
     *
     * @returns The EVM contract abi or null if not initialized.
     */
    getContractABI(): AbiFunctionFragment[] {
        return this.contractABI
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
        let result: EvmOutput<EvmEventArgs> = {
            ok: false,
            error: `getEvmEventArgs error:Not found Event:${name}`,
        }

        if (!this.web3Object || !this.contractObject) {
            return {
                ok: false,
                error: "Web3 or contract is not initialized!",
            }
        }
        const abiFragment = this.contractABI.find(
            (entry) => entry.type === "event" && entry.name === name
        )
        if (!abiFragment) {
            return {
                ok: false,
                error: `getEvmEventArgs: Not found ${name}'s abi fragment`,
            }
        }
        const input = abiFragment.inputs as AbiParameter[]
        const signature =
            this.web3Object.eth.abi.encodeEventSignature(abiFragment)

        try {
            transactionReceipt.logs.forEach((log) => {
                if (signature === (log.topics![0] as string)) {
                    const decodedData = this.web3Object!.eth.abi.decodeLog(
                        input,
                        log.data as string,
                        log.topics as string[]
                    )
                    const originResult = parseEvmReplyData(decodedData)
                    result = {
                        ok: true,
                        data:
                            originResult instanceof Array
                                ? convertArrayToObjectByAbiAndName(
                                      this.getContractABI(),
                                      "event",
                                      name,
                                      originResult,
                                      true
                                  )
                                : originResult,
                    }
                }
            })
        } catch (error) {
            return {
                ok: false,
                error: `getEvmEventArgs error: ${error}`,
            }
        }
        return result
    }

    /**
     * Get the EVM type.
     *
     * @returns The EVM type,Web3 or Ethers.
     */
    getEvmType(): EvmType {
        return EvmType.Web3
    }

    /**
     * Get the EVM provider url.
     *
     * @returns The EVM provider url or null if not initialized.
     */
    getProviderUrl(): string | undefined {
        return this.providerUrl
    }

    /**
     * Get the Ether Provider
     *
     * @returns Ether Provider object or null if not initialized.
     */
    getEtherProvider(): null {
        return null
    }

    /**
     * Web3 getter.
     *
     * @returns Web3 instance or null.
     */
    getWeb3(): Web3 | null {
        return this.web3Object
    }

    /**
     * Sends a transaction.
     *
     * @TODO test window.ethereum
     * @param input - The EVM input.
     * @param options - The transaction options.
     * @returns A promise resolving to EvmOutput object with the result of the transaction.
     */
    async send(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<any>> {
        if (!this.web3Object || !this.contractObject) {
            return {
                ok: false,
                error: "Web3 or contract is not initialized!",
            }
        }

        try {
            const generateTransactionResult = await this.generateTransaction(
                input,
                options
            )
            if (
                !generateTransactionResult.ok ||
                !generateTransactionResult.data
            ) {
                return {
                    ok: false,
                    error: `Generate transaction error: ${generateTransactionResult.error}`,
                }
            }

            let result: TransactionReceipt
            const privateKey = getFromPrivateKey(
                this.wallet as IWallet,
                options
            )
            //TODO
            if (!privateKey) {
                try {
                    result = await this.web3Object.eth.sendTransaction(
                        generateTransactionResult.data
                    )
                } catch (error) {
                    return {
                        ok: false,
                        error: `Send transaction error: ${error}`,
                    }
                }
            } else {
                try {
                    const signResult = await this.sign(input, options)
                    if (!signResult.ok || !signResult.data) {
                        return {
                            ok: false,
                            error: `Sign error: ${signResult.error}`,
                        }
                    }

                    const sendSignedResult = await this.sendSigned(
                        signResult.data
                    )
                    if (!sendSignedResult.ok) {
                        return {
                            ok: false,
                            error: `Send signed transaction error: ${sendSignedResult.error}`,
                        }
                    }
                    result = sendSignedResult.data
                } catch (error) {
                    return {
                        ok: false,
                        error: `Sign and send signed transaction error: ${error}`,
                    }
                }
            }

            return { ok: true, data: result }
        } catch (error) {
            return {
                ok: false,
                error: `Send to contract error: ${error}`,
            }
        }
    }

    /**
     * Sends a signed transaction.
     *
     * @param signedTransaction - The signed transaction.
     * @returns A promise resolving to EvmOutput object with the result of the signed transaction.
     */
    async sendSigned(
        signedTransaction: Web3Signature
    ): Promise<EvmOutput<any>> {
        if (!this.web3Object || !this.contractObject) {
            return {
                ok: false,
                error: "Web3 or contract is not initialized!",
            }
        }
        if (!signedTransaction) {
            return {
                ok: false,
                error: "Signed transaction is null!",
            }
        }

        try {
            const result = await this.web3Object.eth.sendSignedTransaction(
                signedTransaction.rawTransaction
            )
            return { ok: true, data: result }
        } catch (error) {
            return {
                ok: false,
                error: `Send signed transaction error: ${error}`,
            }
        }
    }

    /**
     * Signs a transaction.
     *
     * @param input - The EVM input.
     * @param options - The transaction options.
     * @returns A promise resolving to Result object with the signed transaction.
     */
    async sign(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<Result<Web3Signature>> {
        if (!this.web3Object || !this.contractObject) {
            return {
                ok: false,
                error: "Web3 or contract is not initialized!",
            }
        }

        const privateKey = getFromPrivateKey(this.wallet as IWallet, options)
        if (!privateKey) {
            return {
                ok: false,
                error: "sign missing param: [from]",
            }
        }
        try {
            const generateTransactionResult = await this.generateTransaction(
                input,
                options
            )
            if (
                !generateTransactionResult.ok ||
                !generateTransactionResult.data
            ) {
                return {
                    ok: false,
                    error: `Generate transaction error: ${generateTransactionResult.error}`,
                }
            }

            const result = await this.web3Object.eth.accounts.signTransaction(
                generateTransactionResult.data,
                privateKey!
            )
            return { ok: true, data: result }
        } catch (error) {
            return {
                ok: false,
                error: `Sign error: ${error}`,
            }
        }
    }
}
