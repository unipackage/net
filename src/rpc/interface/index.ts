import { Result } from "@unipackage/utils"
import { InputParams } from "../../shared/types/params"

export interface RPCRequest extends InputParams {}

export interface RPCResponse<T> extends Result<T> {}

export interface RPCEngineConfig {}

export interface RPCRetryOptions {
    retries?: number
    interval?: number //TODO
}

export interface RPCResultRulesOptions {
    acceptUndefined?: boolean
}

export interface RPCOptions {
    retryRules?: RPCRetryOptions
    resultRules?: RPCResultRulesOptions
}

export function isRPCOptions(obj: any): obj is RPCOptions {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (typeof obj.retryRules === "object" ||
            typeof obj.resultRules === "object")
    )
}

export interface IRPC {
    request(
        request: RPCRequest,
        options?: RPCOptions
    ): Promise<RPCResponse<any>>
}
