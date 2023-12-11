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

import { RPCResponse } from "../../../../src/rpc/interface"
import { FilecoinRPC } from "../../../../src/rpc/implements/filecoin"
import { withRequestMethod } from "../../../../src/rpc/withMethod"
import * as dotenv from "dotenv"
dotenv.config()

/**
 * Represents the methods associated with the ChainRPC.
 */
interface ChainRPC {
    ChainHead(): Promise<RPCResponse<any>>
    ChainGetTipSetByHeight(...params: any[]): Promise<RPCResponse<any>>
}

// Decorate the ChainRPC class with dynamically generated methods
//@ts-ignore
@withRequestMethod(["ChainHead", "ChainGetTipSetByHeight"])
class ChainRPC extends FilecoinRPC {}

/**
 * ChainRPC instance to interact with the Filecoin chain.
 */
export const chainRPC = new ChainRPC({
    apiAddress: process.env.LOTUS_API_ENDPOINT as string,
    token: process.env.LOTUS_TOKEN,
})
