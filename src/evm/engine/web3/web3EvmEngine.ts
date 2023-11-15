import {
    Web3,
    ContractAbi,
    Bytes,
    Transaction as Web3Transaction,
    TransactionReceipt,
} from "web3"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { Signature as EtherSignature } from "ethers"
import { Result } from "@unipackage/utils"
import type { Contract } from "web3-eth-contract"
import {
    EvmInput,
    EvmOutput,
    EvmTransactionOptions,
    EvmListenerOptions,
} from "../../interface"
import { EvmEngine, DefaultTransactionOptions } from "../index"

declare global {
    interface Window {
        ethereum?: any // Define ethereum as an optional property
    }
}

export class Web3EVM extends EvmEngine {
    private web3: Web3 | undefined
    private contract: Contract<ContractAbi> | undefined
    private contractAddress: string

    constructor(
        contractABI: ContractAbi,
        contractAddress: string,
        providerUrl?: string
    ) {
        super()

        this.contractAddress = contractAddress
        if (!providerUrl) {
            try {
                this.web3 = new Web3(window.ethereum)
                window.ethereum.enable().then(() => {
                    this.initContract(contractABI, contractAddress)
                })
            } catch (error) {
                console.error("Error enabling Ethereum accounts:", error)
            }
        } else {
            this.web3 = new Web3(providerUrl)
            this.initContract(contractABI, contractAddress)
        }
    }

    private initContract(
        contractABI: ContractAbi,
        contractAddress: string
    ): void {
        if (this.web3) {
            this.contract = new this.web3.eth.Contract(
                contractABI,
                contractAddress,
                {
                    dataInputFill: "both",
                }
            )
        }
    }

    private async generateTransaction(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<Result<Web3Transaction>> {
        try {
            const params: any[] = input.params || []

            if (this.web3 && this.contract) {
                if (options.web3Transaction && options.web3Transaction.from) {
                    const nonce = await this.web3.eth.getTransactionCount(
                        options.web3Transaction.from
                    )
                    const txObject: Web3Transaction = {
                        to: this.contractAddress,
                        //TODO: esmate gas
                        gas: 80000000,
                        maxFeePerGas: this.web3.utils.toWei("10", "gwei"),
                        maxPriorityFeePerGas: this.web3.utils.toWei(
                            "1",
                            "gwei"
                        ),
                        nonce: nonce,
                        ...options.web3Transaction,
                        data: this.contract.methods[input.method](
                            //@ts-ignore
                            ...params
                        ).encodeABI(),
                    }
                    return { ok: true, data: txObject }
                } else {
                    return {
                        ok: false,
                        error: "generateTransaction params errors!",
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "Web3 or contract is not initialized!",
                }
            }
        } catch (error) {
            return {
                ok: false,
                error: `Set contract error: ${error}`,
            }
        }
    }

    private async waitForConfirmations(
        transactionHash: Bytes,
        confirmations: number
    ): Promise<EvmOutput<void>> {
        if (this.web3 && this.contract) {
            let currentBlock = await this.web3.eth.getBlockNumber()
            let startBlock = BigInt(currentBlock)

            while (currentBlock < startBlock + BigInt(confirmations)) {
                const transactionReceipt =
                    await this.web3.eth.getTransactionReceipt(transactionHash)

                if (transactionReceipt && transactionReceipt.blockNumber) {
                    currentBlock = BigInt(transactionReceipt.blockNumber)
                }

                // Sleep for some time before checking again
                await new Promise((resolve) => setTimeout(resolve, 1000))
            }
            return { ok: true }
        } else {
            console.error("Web3 or contract is not initialized!")
            return {
                ok: false,
                error: "Web3 or contract is not initialized!",
            }
        }
    }

    async call(input: EvmInput): Promise<EvmOutput<any>> {
        try {
            const params: any[] = input.params || []

            if (this.web3 && this.contract) {
                const result = await this.contract.methods[input.method](
                    //@ts-ignore
                    ...params
                ).call()
                return { ok: true, data: result }
            } else {
                return {
                    ok: false,
                    error: "Web3 or contract is not initialized!",
                }
            }
        } catch (error) {
            return {
                ok: false,
                error: `Get contract error: ${error}`,
            }
        }
    }

    async sendTransaction(
        input: EvmInput,
        options: EvmTransactionOptions = DefaultTransactionOptions
    ): Promise<EvmOutput<any>> {
        try {
            let result: TransactionReceipt
            const transactionResult = await this.generateTransaction(
                input,
                options
            )

            if (this.web3 && this.contract) {
                if (transactionResult.ok && transactionResult.data) {
                    result = await this.web3.eth.sendTransaction(
                        transactionResult.data
                    )
                } else {
                    return {
                        ok: false,
                        error: "sendTransaction params errors!",
                    }
                }

                if (options.confirmations) {
                    const confirmaResult = await this.waitForConfirmations(
                        result.transactionHash,
                        options.confirmations
                    )
                    if (!confirmaResult.ok) {
                        return { ok: false, error: confirmaResult.error }
                    }
                }
                return { ok: true, data: result }
            } else {
                return {
                    ok: false,
                    error: "Web3 or contract is not initialized!",
                }
            }
        } catch (error) {
            return {
                ok: false,
                error: `Set contract error: ${error}`,
            }
        }
    }

    async signTransaction(
        input: EvmInput,
        options: EvmTransactionOptions,
        privateKey: string
    ): Promise<Result<Web3Signature | EtherSignature>> {
        try {
            const transactionResult = await this.generateTransaction(
                input,
                options
            )

            if (this.web3 && this.contract) {
                if (transactionResult.ok && transactionResult.data) {
                    const result = await this.web3.eth.accounts.signTransaction(
                        transactionResult.data,
                        privateKey
                    )
                    return { ok: true, data: result }
                } else {
                    return {
                        ok: false,
                        error: "sendTransaction params errors!",
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "Web3 or contract is not initialized!",
                }
            }
        } catch (error) {
            return {
                ok: false,
                error: `Set contract error: ${error}`,
            }
        }
    }

    async sendSignedTransaction(
        signedTransaction: Web3Signature
    ): Promise<EvmOutput<any>> {
        try {
            let result: TransactionReceipt
            if (this.web3 && this.contract) {
                if (signedTransaction) {
                    try {
                        result = await this.web3.eth.sendSignedTransaction(
                            signedTransaction.rawTransaction
                        )
                    } catch (error) {
                        return {
                            ok: false,
                            error: `Error when sendSignedTransaction:${error}`,
                        }
                    }
                } else {
                    return {
                        ok: false,
                        error: "sendSignedTransaction params errors!",
                    }
                }

                return { ok: true, data: result }
            } else {
                return {
                    ok: false,
                    error: "Web3 or contract is not initialized!",
                }
            }
        } catch (error) {
            return {
                ok: false,
                error: `sendSignedTransaction error: ${error}`,
            }
        }
    }
    async signAndSendSignedTransaction(
        input: EvmInput,
        options: EvmTransactionOptions,
        privateKey: string
    ): Promise<EvmOutput<any>> {
        try {
            const signatureResult = await this.signTransaction(
                input,
                options,
                privateKey
            )
            if (signatureResult.ok && signatureResult.data) {
                return await this.sendSignedTransaction(
                    signatureResult.data as Web3Signature
                )
            } else {
                return { ok: false, error: "sendSignedTransaction error!" }
            }
        } catch (error) {
            return { ok: false, error }
        }
    }

    listen(
        callback: (error: any, result: any) => void,
        options: EvmListenerOptions
    ): () => void {
        return () => {}
    }
}
