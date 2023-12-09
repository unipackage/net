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

import { RPCRequest, RPCResponse, RPCOptions } from "../../interface"
import { RPCEngine, DefaultOptions } from ".."
import LotusRpcEngine, { LotusRpcEngineConfig } from "@glif/filecoin-rpc-client"

export class FilecoinRPCEngine extends RPCEngine {
    private engine: LotusRpcEngine
    private defaultOptions: RPCOptions

    constructor(config: LotusRpcEngineConfig, defaultOptions?: RPCOptions) {
        super()
        this.engine = new LotusRpcEngine(config)
        this.defaultOptions = defaultOptions ? defaultOptions : DefaultOptions
    }

    public async request(
        request: RPCRequest,
        options: RPCOptions = {}
    ): Promise<RPCResponse<any>> {
        options = { ...this.defaultOptions, ...options }
        return await this.retryRequest(request, options)
    }

    private async engineRequest(
        request: RPCRequest,
        options?: RPCOptions
    ): Promise<RPCResponse<any>> {
        let result: RPCResponse<any> = {
            ok: false,
            data: undefined,
            error: undefined,
        }
        try {
            result.data = request.params
                ? await this.engine.request(request.method, ...request.params)
                : await this.engine.request(request.method)
            result.ok = true
            return result
        } catch (error: any) {
            result.error = error
            if (
                error.code === undefined &&
                options?.resultRules?.acceptUndefined
            ) {
                result.ok = true
                result.error = undefined
                return result
            }
        }
        return result
    }

    private async retryRequest(
        request: RPCRequest,
        options?: RPCOptions
    ): Promise<RPCResponse<any>> {
        let result: RPCResponse<any> = {
            ok: false,
            data: undefined,
            error: undefined,
        }

        if (!options?.retryRules?.retries) {
            return await this.engineRequest(request, options)
        }
        const maxRetries = options.retryRules.retries
        let retries: number = 0

        do {
            try {
                result = await this.engineRequest(request, options)
                if (result.ok) {
                    return result
                } else {
                    retries++
                    retries <= maxRetries
                        ? console.log(
                              new Date().toLocaleString(),
                              `Warning: error.code=${result.error.code}, retrying RPC the ${retries} times`
                          )
                        : console.log(
                              new Date().toLocaleString(),
                              `Error: error.code=${result.error.code}, already retried RPC ${maxRetries} times`
                          )
                }
            } catch (error: any) {
                result.error = error
            }
        } while (retries <= maxRetries)

        return result
    }
}
