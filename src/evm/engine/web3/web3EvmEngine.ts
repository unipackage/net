import { Web3, ContractAbi, Bytes } from "web3"
import type { Contract } from "web3-eth-contract"
import {
    EvmInput,
    EvmOutput,
    EvmExecuteOptions,
    EvmListenerOptions,
} from "../../interface"
import { EvmEngine, DefaultExecuteOptions } from "../index"

declare global {
    interface Window {
        ethereum?: any // Define ethereum as an optional property
    }
}
export class Web3EVM extends EvmEngine {
    private web3: Web3 | undefined
    private contract: Contract<ContractAbi> | undefined

    constructor(
        contractABI: ContractAbi,
        contractAddress: string,
        providerUrl?: string
    ) {
        super()

        if (!providerUrl) {
            try {
                this.web3 = new Web3(window.ethereum)
                window.ethereum
                    .enable()
                    .then(() => {
                        this.initContract(contractABI, contractAddress)
                    })
                    .catch((error: any) => {
                        console.error(
                            "Error enabling Ethereum accounts:",
                            error
                        )
                    })
            } catch (error) {
                console.error("Error enabling Ethereum accounts:", error)
            }
        } else if (providerUrl) {
            this.web3 = new Web3(providerUrl)
            this.initContract(contractABI, contractAddress)
        } else {
            console.error("No Web3 provider found!")
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
                    dataInputFill: "data",
                }
            )
        }
    }

    async execute(
        input: EvmInput,
        options: EvmExecuteOptions = DefaultExecuteOptions
    ): Promise<EvmOutput<any>> {
        try {
            const params: any[] = input.params || []

            if (this.web3 && this.contract) {
                if (options.useSendTransaction) {
                    const transactionObject: any = {
                        from: options.from
                            ? options.from
                            : this.web3.eth.defaultAccount,
                        data: this.contract.methods[input.method](
                            //@ts-ignore
                            ...params
                        ).encodeABI(),
                        ...(options.gas || {}),
                    }

                    if (options.value) {
                        transactionObject.value = options.value
                    }

                    const result = await this.web3.eth.sendTransaction(
                        transactionObject
                    )

                    if (options.confirmations) {
                        const res = await this.waitForConfirmations(
                            result.transactionHash,
                            options.confirmations
                        )
                        if (res.ok) {
                            return { ok: true, data: result }
                        } else {
                            return { ok: false, error: res.error }
                        }
                    }
                    return { ok: true, data: result }
                } else {
                    const result = await this.contract.methods[input.method](
                        //@ts-ignore
                        ...params
                    ).call()
                    return { ok: true, data: result }
                }
            } else {
                console.error("Web3 or contract is not initialized!")
                return {
                    ok: false,
                    error: "Web3 or contract is not initialized!",
                }
            }
        } catch (error) {
            console.error("Execution Error:", error)
            return {
                ok: false,
                error: `Execution Error: ${error}`,
            }
        }
    }

    listen(
        callback: (error: any, result: any) => void,
        options: EvmListenerOptions
    ): () => void {
        return () => {}
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
}
