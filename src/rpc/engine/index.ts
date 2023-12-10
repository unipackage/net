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

import { IRPC, RPCRequest, RPCResponse, RPCOptions } from "../interface"

/**
 * Abstract class providing the blueprint for an RPC Engine.
 */
export abstract class RPCEngine implements IRPC {
    /**
     * Abstract method to be implemented by derived classes for handling RPC requests.
     *
     * @param request - The RPC request object.
     * @param options - Configuration options for the request.
     * @returns A promise resolving to an RPCResponse.
     */
    abstract request<T>(
        request: RPCRequest,
        options?: RPCOptions
    ): Promise<RPCResponse<T>>
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
