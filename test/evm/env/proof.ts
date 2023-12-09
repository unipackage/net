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

import DatasetProofAbi from "../testAbi/DatasetsProof.json"
import { Web3Evm } from "../../../src/evm/implements/web3"
import { EthersEvm } from "../../../src/evm/implements/ether"
import { withMethods } from "../../../src/shared/withMethods"
import { EvmOutput, isEvmTransactionOptions } from "../../../src/evm/interface"
import { providerUrl, proofContractAddress } from "./constant"

/**
 * Interface for Web3Proof containing specific methods.
 */
interface Web3Proof {
    appendDatasetCollateral(...params: any[]): Promise<EvmOutput<any>>
}

//@ts-ignore
@withMethods(["appendDatasetCollateral"], "send", isEvmTransactionOptions)
/**
 * Decorated class for Web3Evm implementation of Proof.
 */
class Web3Proof extends Web3Evm {}

/**
 * Instance of Web3Proof initialized with provided configuration.
 */
export const web3Proof = new Web3Proof(
    DatasetProofAbi.abi,
    proofContractAddress,
    providerUrl
)

/**
 * Interface for EthersProof containing specific methods.
 */
interface EthersProof {
    appendDatasetCollateral(...params: any[]): Promise<EvmOutput<any>>
}

//@ts-ignore
@withMethods(["appendDatasetCollateral"], "send", isEvmTransactionOptions)
/**
 * Decorated class for EthersEvm implementation of Proof.
 */
class EthersProof extends EthersEvm {}

/**
 * Instance of EthersProof initialized with provided configuration.
 */
export const ethersProof = new EthersProof(
    DatasetProofAbi.abi,
    proofContractAddress,
    providerUrl
)
