/*******************************************************************************
 *   (c) 2023 Dataswap
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

import DatasetsAbi from "../testAbi/Datasets.json"
import { Web3Evm } from "../../../src/evm/implements/web3"
import { EthersEvm } from "../../../src/evm/implements/ether"
import { withMethods } from "../../../src/shared/withMethods"
import { EvmOutput, isEvmTransactionOptions } from "../../../src/evm/interface"
import { datasetContractAddress, providerUrl } from "./constant"

/**
 * Interface for Web3Datasets containing specific methods.
 */
interface Web3Datasets {
    getDatasetMetadata(id: number): Promise<EvmOutput<any>>
    getDatasetMetadataSubmitter(id: number): Promise<EvmOutput<string>>
    submitDatasetMetadata(...params: any[]): Promise<EvmOutput<any>>
}

//@ts-ignore
@withMethods(["getDatasetMetadata", "getDatasetMetadataSubmitter"], "call")
//@ts-ignore
@withMethods(["submitDatasetMetadata"], "send", isEvmTransactionOptions)
/**
 * Decorated class for Web3Evm implementation of Datasets.
 */
class Web3Datasets extends Web3Evm {}

/**
 * Instance of Web3Datasets initialized with provided configuration.
 */
export const web3Datasets = new Web3Datasets(
    DatasetsAbi.abi,
    datasetContractAddress,
    providerUrl
)

/**
 * Interface for EthersDatasets containing specific methods.
 */
interface EthersDatasets {
    getDatasetMetadata(id: number): Promise<EvmOutput<any>>
    getDatasetMetadataSubmitter(id: number): Promise<EvmOutput<string>>
    submitDatasetMetadata(...params: any[]): Promise<EvmOutput<any>>
}

//@ts-ignore
@withMethods(["getDatasetMetadata", "getDatasetMetadataSubmitter"], "call")
//@ts-ignore
@withMethods(["submitDatasetMetadata"], "send", isEvmTransactionOptions)
/**
 * Decorated class for EthersEvm implementation of Datasets.
 */
class EthersDatasets extends EthersEvm {}

/**
 * Instance of EthersDatasets initialized with provided configuration.
 */
export const ethersDatasets = new EthersDatasets(
    DatasetsAbi.abi,
    datasetContractAddress,
    providerUrl
)
