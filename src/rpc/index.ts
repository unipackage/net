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

import { IRPC, RPCOptions, RPCRequest, RPCResponse } from "./interface"
import { RPCEngine } from "./engine"

/**
 * Class implementing the IRPC interface to handle Remote Procedure Calls (RPCs).
 */
export class RPC implements IRPC {
    private engine: RPCEngine

    /**
     * Constructs an RPC instance with a given RPCEngine.
     *
     * @param engine - The RPCEngine instance used to handle RPC requests.
     */
    constructor(engine: RPCEngine) {
        this.engine = engine
    }

    /**
     * Sends an RPC request using the RPCEngine.
     *
     * @param request - The RPC request object.
     * @param options - Optional configuration options for the request.
     * @returns A promise resolving to an RPCResponse.
     */
    public async request(
        request: RPCRequest,
        options?: RPCOptions | undefined
    ): Promise<RPCResponse<any>> {
        return await this.engine.request(request, options)
    }
}
