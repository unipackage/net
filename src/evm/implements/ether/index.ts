/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under the GNU General Public License, Version 3.0 or later (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/
import {
    InterfaceAbi,
    Contract,
    JsonFragment,
    ethers,
    Transaction,
    TransactionRequest,
    assertArgument,
    Wallet,
    Result as EthersResult,
} from "ethers"
import { EtherUnits } from "web3-utils"
import { Result } from "@unipackage/utils"
import {
    EvmDecodeOutPut,
    EvmInput,
    EvmOutput,
    EvmTransactionOptions,
    EvmType,
    IEVM,
    defaultTransactionOptions,
} from "../../interface"

/**
 * Define ethereum as an optional property.
 */
declare global {
    interface Window {
        ethereum?: any
    }
}

/**
 * Class representing a EthersEvm instance.
 */
export class EthersEvm implements IEVM {
    private provider: ethers.JsonRpcProvider | ethers.BrowserProvider | null =
        null
    private contract: Contract | null = null
    private contractAddress: string
    private contractABI: InterfaceAbi
    private providerUrl: string | undefined = undefined

    /**
     * Constructor for EthersEvm class.
     *
     * @TODO test window.ethereum
     * @param contractABI - The contract's ABI.
     * @param contractAddress - The contract's address.
     * @param providerUrl - The provider URL.
     */
    constructor(
        contractABI: InterfaceAbi,
        contractAddress: string,
        providerUrl?: string
    ) {
        this.contractAddress = contractAddress
        this.contractABI = contractABI
        this.providerUrl = providerUrl

        if (!providerUrl) {
            if (window.ethereum) {
                this.provider = new ethers.BrowserProvider(window.ethereum)
            } else {
                throw new Error("window.ethereum is not available")
            }
        } else {
            this.provider = new ethers.JsonRpcProvider(this.providerUrl)
        }
        this.contract = new ethers.Contract(
            contractAddress,
            contractABI,
            this.provider
        )
    }

    /**
     * Generates a value in Wei based on the provided number and unit.
     *
     * @param number - The number to convert to Wei.
     * @param unit - The unit to convert the number to (e.g., Ether, Gwei).
     * @returns The generated value in Wei as a string or bigint.
     */
    generateWei(number: string, unit: EtherUnits): bigint {
        return ethers.parseUnits(number, unit)
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
    ): Promise<EvmOutput<TransactionRequest>> {
        if (!this.provider || !this.contract) {
            return {
                ok: false,
                error: "Ethers provider or contract is not initialized!",
            }
        }

        if (!options.from) {
            return {
                ok: false,
                error: "generateTransaction missing param: [from]",
            }
        }

        try {
            const nonce = await this.provider.getTransactionCount(options.from)

            const dataResult = this.encodeEvmInputToTxinput(input)
            if (!dataResult.ok) {
                return {
                    ok: false,
                    error: dataResult.error,
                }
            }

            const txOriginObject = {
                ...defaultTransactionOptions,
                from: options.from,
                to: this.contractAddress,
                nonce: nonce,
                ...options,
                data: dataResult.data,
            }
            const gas = await this.provider.estimateGas(txOriginObject)
            const feeData = await this.provider.getFeeData()
            const maxFeePerGas = feeData.maxFeePerGas
            const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas

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
     * Calls a contract function.
     *
     * @param input - The EVM input.
     * @returns A promise resolving to EvmOutput object with the result of the contract call.
     */
    async call(input: EvmInput): Promise<EvmOutput<any>> {
        if (!this.provider || !this.contract) {
            return {
                ok: false,
                error: "Ethers provider or contract is not initialized!",
            }
        }

        try {
            const params: any[] = input.params || []
            const result = await this.contract![input.method](
                //@ts-ignore
                ...params
            )

            return {
                ok: true,
                data:
                    result instanceof EthersResult ? result.toArray() : result,
            }
        } catch (error) {
            return {
                ok: false,
                error: `Call contract error: ${error}`,
            }
        }
    }

    /**
     * Decode the transaction input on the EVM.
     *
     * @param txInput - The transaction input data.
     * @returns A promise that resolves to the decoded output.
     */
    decodeTxInput(txInput: string): EvmOutput<EvmDecodeOutPut> {
        if (!this.contract) {
            return {
                ok: false,
                error: "Contract is not initialized!",
            }
        }
        try {
            const abi = this.contract.interface.parseTransaction({
                data: txInput,
            })
            return {
                ok: true,
                data: {
                    method: abi!.name,
                    params: abi!.args.toArray(),
                },
            }
        } catch (error) {
            return {
                ok: false,
                error: `decodeTxinput error:${error}`,
            }
        }
    }

    /**
     * Encode EVM input to transaction input data.
     *
     * @param input - The input parameters for the EVM operation.
     * @returns A promise that resolves to the encoded transaction input.
     */
    encodeEvmInputToTxinput(input: EvmInput): EvmOutput<string> {
        const params: any[] = input.params || []
        if (!this.contract) {
            return {
                ok: false,
                error: "Contract is not initialized!",
            }
        }

        try {
            return {
                ok: true,
                data: this.contract.interface.encodeFunctionData(
                    input.method,
                    params
                ),
            }
        } catch (error) {
            return {
                ok: false,
                error: `Encode EVM input to transaction input error: ${error}`,
            }
        }
    }

    /**
     * Encode function signature using the ABI.
     *
     * @param abi - The ABI function fragment.
     * @returns The encoded function signature or an error result.
     */
    encodeFunctionSignatureByAbi(abi: JsonFragment): Result<string> {
        return this.encodeFunctionSignatureByFuntionName(abi.name!)
    }

    /**
     * Encode function signature using the function name.
     *
     * @param name - The name of the function.
     * @returns A promise that resolves to the encoded function signature or an error result.
     */
    encodeFunctionSignatureByFuntionName(name: string): EvmOutput<string> {
        if (!this.contract) {
            return {
                ok: false,
                error: "Contract is not initialized!",
            }
        }
        const f = this.contract.interface.getFunction(name)
        assertArgument(f, "unknown function", "fragment", name)

        return {
            ok: true,
            data: f.selector,
        }
    }

    /**
     * Get the EVM contract.
     *
     * @returns The EVM contract object or null if not initialized.
     */
    getContract(): Contract | null {
        if (this.contract) {
            return this.contract
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
    getContractABI(): JsonFragment[] {
        return this.contractABI as JsonFragment[]
    }

    /**
     * Get the EVM type.
     *
     * @returns The EVM type,Web3 or Ethers.
     */
    getEvmType(): EvmType {
        return EvmType.Ethers
    }

    /**
     * Get the EVM provider url.
     *
     * @returns The EVM provider url or undefined not initialized.
     */
    getProviderUrl(): string | undefined {
        return this.providerUrl
    }

    /**
     * Get the Ether Provider
     *
     * @returns Ether Provider object or null if not initialized.
     */
    getEtherProvider(): ethers.AbstractProvider | null {
        return this.provider
    }

    /**
     * Get the Web3 object.
     *
     * @returns The Web3 object or null if not initialized.
     */
    getWeb3(): null {
        return null
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
    ): Promise<EvmOutput<any>> {
        if (!this.provider || !this.contract) {
            return {
                ok: false,
                error: "Ethers provider or contract is not initialized!",
            }
        }
        try {
            if (!options.privateKey) {
                const txRes = await this.generateTransaction(input, options)
                if (!txRes.ok || !txRes.data) {
                    return {
                        ok: false,
                        error: `${txRes.error} or txObj is null`,
                    }
                }
                const signer = await this.provider.getSigner()
                const result = await signer.sendTransaction(txRes.data)
                return { ok: true, data: result }
            } else {
                const signedRes = await this.sign(input, options)
                if (!signedRes.ok || !signedRes.data) {
                    return {
                        ok: false,
                        error: `${signedRes.error} or sign data is null`,
                    }
                }
                const sendSignedRes = await this.sendSigned(signedRes.data!)
                if (!sendSignedRes.ok) {
                    return {
                        ok: false,
                        error: `${sendSignedRes.error} `,
                    }
                }
                return { ok: true, data: sendSignedRes.data }
            }
        } catch (error) {
            return {
                ok: false,
                error: `send error:${error}`,
            }
        }
    }

    /**
     * Send a signed transaction to the EVM.
     *
     * @param signed - The signed transaction data.
     * @returns A promise that resolves to the transaction result.
     */
    async sendSigned(signed: string): Promise<EvmOutput<any>> {
        if (!this.provider || !this.contract) {
            return {
                ok: false,
                error: "Ethers provider or contract is not initialized!",
            }
        }

        try {
            const result = await this.provider.broadcastTransaction(signed)
            return {
                ok: true,
                data: result,
            }
        } catch (error) {
            return {
                ok: false,
                error: `sendSigned error:${error}`,
            }
        }
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
    ): Promise<EvmOutput<string>> {
        if (!this.provider || !this.contract) {
            return {
                ok: false,
                error: "Ethers provider or contract is not initialized!",
            }
        }

        try {
            // Ensure the private key is provided in options
            if (!options.privateKey) {
                throw new Error("Private key is missing in options")
            }

            // Create a wallet from the private key
            const wallet = new Wallet(options.privateKey, this.provider)

            const txRes = await this.generateTransaction(input, options)
            if (!txRes.ok || !txRes.data) {
                return {
                    ok: false,
                    error: `${txRes.error} or txObj is null`,
                }
            }

            const pop = await wallet.populateTransaction(txRes.data!)
            delete pop.from
            const txObj = Transaction.from(pop)
            // Sign the transaction
            const signedTransaction = await wallet.signTransaction(txObj)

            return {
                ok: true,
                data: signedTransaction,
            }
        } catch (error) {
            return {
                ok: false,
                error: `sign error: ${error}`,
            }
        }
    }
}
