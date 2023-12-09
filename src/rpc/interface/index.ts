/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under the GNU General Public License, Version 3.0 or later (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
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
export interface IRPC {
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
