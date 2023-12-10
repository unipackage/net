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
