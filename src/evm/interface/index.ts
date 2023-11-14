import { Result } from "@unipackage/utils"
import { InputParams } from "../../shared/types/params"

export interface EvmInput extends InputParams {}

export interface EvmOutput<T> extends Result<T> {}

export interface GasOptions {
    gasLimit: number
    gasPrice: number
}

export interface EvmListenerOptions {
    eventName?: string
    eventAddress?: string
    fromBlock?: number
    toBlock?: number
}

export interface EvmExecuteOptions {
    useSendTransaction?: boolean
    from?: string
    gas?: GasOptions
    value?: number
    confirmations: number
}

export interface IEVM {
    execute(
        input: EvmInput,
        options?: EvmExecuteOptions
    ): Promise<EvmOutput<any>>

    listen(
        callback: (event: any) => void,
        options: EvmListenerOptions
    ): () => void
}
