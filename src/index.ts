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

export {
    IRPC,
    RPCEngineConfig,
    RPCOptions,
    RPCRequest,
    RPCResponse,
    RPCResultRulesOptions,
    RPCRetryOptions,
    isRPCOptions,
    DefaultOptions,
} from "./rpc/interface"
export { FilecoinRPC } from "./rpc/implements/filecoin"
export { withRequestMethod } from "./rpc/withMethod"

export { withMethods } from "./shared/withMethods"
export { InputParams } from "./shared/types/params"

export {
    defaultTransactionOptions,
    EvmType,
    EvmInput,
    EvmOutput,
    EvmTransactionOptions,
    IEVM,
    isEvmTransactionOptions,
} from "./evm/interface"
export { Web3Evm } from "./evm/implements/web3"
export { EthersEvm } from "./evm/implements/ether"
export {
    getEncodedParamsFromTxinput,
    getFunctionSignatureFromTxinput,
} from "./evm/implements/web3/tools"
export { withCallMethod, withSendMethod } from "./evm/withMethod"
