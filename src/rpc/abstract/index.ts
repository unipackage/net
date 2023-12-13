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

import { RPCRequest, RPCResponse, RPCOptions, IRPCEngine } from "../interface"

/**
 * AbstractRpc class.
 */
export class AbstractRpc {
    private engine: IRPCEngine

    constructor(engine: IRPCEngine) {
        this.engine = engine
    }

    /**
     * Sends an RPC request with optional configuration options.
     *
     * @param request - The RPC request object.
     * @param options - Optional configuration options for the request.
     * @returns A promise resolving to an RPCResponse.
     */
    async request(
        request: RPCRequest,
        options?: RPCOptions
    ): Promise<RPCResponse<any>> {
        return await this.engine.request(request, options)
    }
}
