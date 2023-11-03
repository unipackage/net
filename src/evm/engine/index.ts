import {
    IEVM,
    EvmInput,
    EvmOutput,
    EvmExecuteOptions,
    EvmListenerOptions,
} from "../interface"

export abstract class EvmEngine implements IEVM {
    //future some common method add here
    abstract execute<T>(
        input: EvmInput,
        options?: EvmExecuteOptions
    ): Promise<EvmOutput<T>>

    abstract listen(
        callback: (event: any) => void,
        options: EvmListenerOptions
    ): () => void
}

export const DefaultExecuteOptions: EvmExecuteOptions = {
    useSendTransaction: false,
    confirmation: {
        confirmations: 1,
        timeout: 3,
    },
}
