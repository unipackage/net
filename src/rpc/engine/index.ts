import { IRPC, RPCRequest, RPCResponse, RPCOptions } from "../interface"

export abstract class RPCEngine implements IRPC {
    //future some common method add here
    abstract request<T>(
        request: RPCRequest,
        options?: RPCOptions
    ): Promise<RPCResponse<T>>
}

export const DefaultOptions: RPCOptions = {
    retryRules: {
        retries: 3,
        interval: 1000,
    },
    resultRules: {
        acceptUndefined: false,
    },
}
