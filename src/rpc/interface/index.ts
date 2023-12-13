/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under either the MIT License (the "MIT License") or the Apache License, Version 2.0
 *  (the "Apache License"). You may not use this file except in compliance with one of these
 *  licenses. You may obtain a copy of the MIT License at
 *
 *      https://opensource.org/licenses/MIT
 *
 *  Or the Apache License, Version 2.0 at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the MIT License or the Apache License for the specific language governing permissions and
 *  limitations under the respective licenses.
 ********************************************************************************/

import { Result } from "@unipackage/utils"
import { InputParams } from "../../shared/types/params"

/**
 * Defines the structure of an RPC request, extending the InputParams interface.
 */
export interface RPCRequest extends InputParams {}

/**
 * Defines the structure of an RPC response, extending the Result interface.
 *
 * @template T - The type of the response.
 */
export interface RPCResponse<T> extends Result<T> {}

/**
 * Configuration interface for the RPC engine.
 */
export interface RPCEngineConfig {}

/**
 * Options for retrying an RPC request in case of failure.
 */
export interface RPCRetryOptions {
    retries?: number
    interval?: number // TODO: Specify the interval type
}

/**
 * Options for defining rules about the RPC result.
 */
export interface RPCResultRulesOptions {
    acceptUndefined?: boolean
}

/**
 * Options that can be passed in an RPC request.
 */
export interface RPCOptions {
    retryRules?: RPCRetryOptions
    resultRules?: RPCResultRulesOptions
}

/**
 * Default RPC configuration options.
 */
export const DefaultOptions: RPCOptions = {
    retryRules: {
        retries: 3,
        interval: 1000,
    },
    resultRules: {
        acceptUndefined: false,
    },
}

/**
 * Type guard function to check whether an object conforms to the RPCOptions interface.
 *
 * @param obj - The object to be checked.
 * @returns A boolean indicating whether the object conforms to the RPCOptions interface.
 */
export function isRPCOptions(obj: any): obj is RPCOptions {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (typeof obj.retryRules === "object" ||
            typeof obj.resultRules === "object")
    )
}

/**
 * Interface representing an RPC (Remote Procedure Call).
 * It defines a method for making RPC requests.
 */
export interface IRPCEngine {
    /**
     * Sends an RPC request with optional configuration options.
     *
     * @param request - The RPC request object.
     * @param options - Optional configuration options for the request.
     * @returns A promise resolving to an RPCResponse.
     */
    request(
        request: RPCRequest,
        options?: RPCOptions
    ): Promise<RPCResponse<any>>
}

/**
 * Interface representing an RPC (Remote Procedure Call).
 * It defines a method for making RPC requests.
 */
export interface IRPC extends IRPCEngine {
    /*
        add common method
     */
}
