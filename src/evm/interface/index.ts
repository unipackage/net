import { Result } from "@unipackage/utils"

export interface EvmInput {
    method: string
    params?: any[]
}

export interface EvmOutput<T> extends Result<T> {}

export interface GasOptions {
    gasLimit: number
    gasPrice: number
}

export interface ConfirmationOptions {
    confirmations: number
    timeout: number
}

export interface EvmListenerOptions {
    eventName?: string
    eventAddress?: string
    fromBlock?: number
    toBlock?: number
}

export interface EvmExecuteOptions {
    useSendTransaction?: boolean
    gas?: GasOptions
    confirmation?: ConfirmationOptions
}

export function isEvmExecuteOptions(obj: any): boolean {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (typeof obj.useSendTransaction === "boolean" ||
            typeof obj.gas === "object" ||
            typeof obj.confirmation === "object")
    )
}

export function isEvmListenerOptions(obj: any): boolean {
    return (
        (typeof obj === "object" &&
            obj !== null &&
            (typeof obj.eventName === "string" ||
                typeof obj.eventAddress === "string" ||
                typeof obj.fromBlock === "number")) ||
        typeof obj.toBlock === "number"
    )
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
