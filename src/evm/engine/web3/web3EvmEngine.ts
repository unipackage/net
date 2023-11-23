import {
    Web3,
    Transaction as Web3Transaction,
    TransactionReceipt,
    AbiFunctionFragment,
    AbiInput,
} from "web3"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { Result } from "@unipackage/utils"
import type { Contract } from "web3-eth-contract"
import {
    EvmDecodeOutPut,
    EvmInput,
    EvmOutput,
    EvmTransactionOptions,
} from "../../interface"
import { EvmEngine, DefaultTransactionOptions } from "../index"

declare global {
    interface Window {
        ethereum?: any // Define ethereum as an optional property
    }
}

export class Web3EvmEngine extends EvmEngine {
    private web3: Web3 | null = null
    private contract: Contract<AbiFunctionFragment[]> | undefined
    private contractAddress: string
    private contractABI: AbiFunctionFragment[]

    constructor(
        contractABI: AbiFunctionFragment[],
        contractAddress: string,
        providerUrl?: string
    ) {
        super()
        this.contractAddress = contractAddress
        this.contractABI = contractABI
        if (!providerUrl) {
            try {
                this.web3 = new Web3(window.ethereum)
                //TODO: to be test
                window.ethereum.enable().then(() => {
                    this.initContract(contractABI, contractAddress)
                })
            } catch (error) {
                console.error("Error enabling window ethereum accounts:", error)
            }
        } else {
            this.web3 = new Web3(providerUrl)
            this.initContract(contractABI, contractAddress)
        }
    }

    private async generateTransaction(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<Web3Transaction>> {
        if (!this.web3 || !this.contract) {
            return {
                ok: false,
                error: "web3 or contract is not initialized!",
            }
        }
        if (!options.from) {
            return {
                ok: false,
                error: "generateTransaction missing parama: [from]",
            }
        }

        try {
            const params: any[] = input.params || []
            const nonce = await this.web3.eth.getTransactionCount(options.from)

            const txObject: Web3Transaction = {
                ...DefaultTransactionOptions,
                to: this.contractAddress,
                //TODO: esmate gas
                gas: 200000000,
                maxFeePerGas: this.web3.utils.toWei("10", "gwei"),
                maxPriorityFeePerGas: this.web3.utils.toWei("1", "gwei"),
                nonce: nonce,
                ...options,
                data: this.contract.methods[input.method](
                    //@ts-ignore
                    ...params
                ).encodeABI(),
            }

            return { ok: true, data: txObject }
        } catch (error) {
            return {
                ok: false,
                error: `generateTransaction error: ${error}`,
            }
        }
    }

    private initContract(
        contractABI: AbiFunctionFragment[],
        contractAddress: string
    ): EvmOutput<void> {
        if (!this.web3) {
            return {
                ok: false,
                error: "web3 is not initialized!",
            }
        }
        this.contract = new this.web3.eth.Contract(
            contractABI,
            contractAddress,
            {
                dataInputFill: "data",
            }
        )
        return { ok: true }
    }

    async call(input: EvmInput): Promise<EvmOutput<any>> {
        if (!this.web3 || !this.contract) {
            return {
                ok: false,
                error: "web3 or contract is not initialized!",
            }
        }

        try {
            const params: any[] = input.params || []
            const result = await this.contract.methods[input.method](
                //@ts-ignore
                ...params
            ).call()

            return { ok: true, data: parseData(result!) }
        } catch (error) {
            return {
                ok: false,
                error: `call contract error: ${error}`,
            }
        }
    }

    getWeb3Object(): Web3 | null {
        if (this.web3) {
            return this.web3
        } else {
            return null
        }
    }

    decodeTxInput(txInput: string): EvmOutput<EvmDecodeOutPut> {
        if (!this.web3 || !this.contract) {
            return {
                ok: false,
                error: "web3 or contract is not initialized!",
            }
        }
        try {
            const encodedFunctionName = txInput.slice(0, 10)
            const encodedParamas = "0x" + txInput.slice(10)
            const matchingFunction = this.contractABI.find((method) => {
                if (method.type === "function") {
                    const signature =
                        this.web3!.eth.abi.encodeFunctionSignature(
                            method as AbiFunctionFragment
                        )
                    return signature === encodedFunctionName
                }
            })
            if (!matchingFunction) {
                return {
                    ok: false,
                    error: "Not found function from Abi!",
                }
            }
            const decodedParams = this.web3.eth.abi.decodeParameters(
                matchingFunction.inputs as AbiInput[],
                encodedParamas
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
                    params: parseData(decodedParams),
                },
            }
        } catch (error) {
            console.log(error)
            return {
                ok: false,
                error: `decodeTxInput error:${error}!`,
            }
        }
    }

    async send(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<any>> {
        if (!this.web3 || !this.contract) {
            return {
                ok: false,
                error: "web3 or contract is not initialized!",
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
                    error: `generate transaction error:${generateTransactionResult.error}`,
                }
            }

            let result: TransactionReceipt
            if (!options.privateKey) {
                //TODO: to be test
                try {
                    result = await this.web3.eth.sendTransaction(
                        generateTransactionResult.data
                    )
                } catch (error) {
                    return {
                        ok: false,
                        error: `sendTransaction error:${error}`,
                    }
                }
            } else {
                try {
                    const signResult = await this.sign(input, options)
                    if (!signResult.ok || !signResult.data) {
                        return {
                            ok: false,
                            error: `sign error:${signResult.error}`,
                        }
                    }

                    const sendSignedResult = await this.sendSigned(
                        signResult.data
                    )
                    if (!sendSignedResult.ok) {
                        return {
                            ok: false,
                            error: `sendSigned error:${sendSignedResult.error}`,
                        }
                    }
                    result = sendSignedResult.data
                } catch (error) {
                    return {
                        ok: false,
                        error: `sign and sendSigned error:${error}`,
                    }
                }
            }

            return { ok: true, data: result }
        } catch (error) {
            return {
                ok: false,
                error: `send to contract error: ${error}`,
            }
        }
    }

    async sign(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<Result<Web3Signature>> {
        if (!this.web3 || !this.contract) {
            return {
                ok: false,
                error: "web3 or contract is not initialized!",
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
                    error: `generate transaction error:${generateTransactionResult.error}`,
                }
            }

            const result = await this.web3.eth.accounts.signTransaction(
                generateTransactionResult.data,
                options.privateKey!
            )
            return { ok: true, data: result }
        } catch (error) {
            return {
                ok: false,
                error: `sign error: ${error}`,
            }
        }
    }

    async sendSigned(
        signedTransaction: Web3Signature
    ): Promise<EvmOutput<any>> {
        if (!this.web3 || !this.contract) {
            return {
                ok: false,
                error: "web3 or contract is not initialized!",
            }
        }
        if (!signedTransaction) {
            return {
                ok: false,
                error: "signedTransaction is null!",
            }
        }

        try {
            const result = await this.web3.eth.sendSignedTransaction(
                signedTransaction.rawTransaction
            )
            return { ok: true, data: result }
        } catch (error) {
            return {
                ok: false,
                error: `sendSignedTransaction error: ${error}`,
            }
        }
    }
}

type ParsedData = {
    [key: string]: any
}

function parseData(data: ParsedData): Record<string, any> {
    const result: Record<string, any> = {}

    for (const prop in data) {
        if (!isNaN(parseInt(prop)) || prop === "__length__") {
            continue
        }

        if (prop.startsWith("_")) {
            const key = prop.replace(/^_+/, "")
            result[key] = data[prop]
        } else {
            result[prop] = data[prop]
        }
    }

    return result
}
