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
    IRPCEngine,
    RPCEngineConfig,
    RPCOptions,
    RPCRequest,
    RPCResponse,
    RPCResultRulesOptions,
    RPCRetryOptions,
    isRPCOptions,
    DefaultOptions,
} from "./rpc/interface"
export { FilecoinRPCEngine } from "./rpc/engine/filecoin"
export { withRequestMethod } from "./rpc/withMethod"
export { Rpc } from "./rpc/"
export { AbstractRpc } from "./rpc/abstract"

export { withMethods } from "./shared/withMethods"
export { InputParams } from "./shared/types/params"

export {
    defaultTransactionOptions,
    EvmType,
    EvmInput,
    EvmOutput,
    EvmTransactionOptions,
    IEVMEngine,
    IEVM,
    isEvmTransactionOptions,
} from "./evm/interface"
export { Web3EvmEngine } from "./evm/engine/web3"
export { EthersEvmEngine } from "./evm/engine/ether"
export {
    getEncodedParamsFromTxinput,
    getFunctionSignatureFromTxinput,
} from "./evm/engine/web3/tools"
export { withCallMethod, withSendMethod } from "./evm/withMethod"
export { Evm } from "./evm/"
export { AbstractEvm } from "./evm/abstract"
