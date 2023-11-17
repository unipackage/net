import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { Signature as EtherSignature } from "ethers"
import { EvmInput, EvmOutput, EvmTransactionOptions, IEVM } from "./interface"
import { EvmEngine } from "./engine"
import Web3, { AbiFunctionFragment } from "web3"
import { Web3EvmEngine } from "./engine/web3/web3EvmEngine"

export class EVM implements IEVM {
    private engine: EvmEngine

    constructor(engine: EvmEngine) {
        this.engine = engine
    }

    public async call(input: EvmInput): Promise<EvmOutput<any>> {
        return await this.engine.call(input)
    }

    public async send(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<any>> {
        return await this.engine.send(input, options)
    }

    public async sign(
        input: EvmInput,
        options: EvmTransactionOptions
    ): Promise<EvmOutput<Web3Signature | EtherSignature>> {
        return await this.engine.sign(input, options)
    }

    public async sendSigned(
        signedTransaction: Web3Signature | EtherSignature
    ): Promise<EvmOutput<any>> {
        return await this.engine.sendSigned(signedTransaction)
    }

    public getWeb3Object(): Web3 | null {
        return this.engine.getWeb3Object()
    }

    public decodeTxInput(txInput: string): EvmOutput<any> {
        return this.engine.decodeTxInput(txInput)
    }
}

export class Web3Evm extends EVM {
    constructor(
        abi: AbiFunctionFragment[],
        address: string,
        providerUrl?: string
    ) {
        super(new Web3EvmEngine(abi, address, providerUrl))
    }
}
