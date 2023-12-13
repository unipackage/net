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

import DatasetsAbi from "../testAbi/Datasets.json"
import { Evm } from "../../../src/evm/"
import { Web3EvmEngine } from "../../../src/evm/engine/web3"
import { EthersEvmEngine } from "../../../src/evm/engine/ether"
import { EvmOutput } from "../../../src/evm/interface"
import { withCallMethod, withSendMethod } from "../../../src/evm/withMethod"
import * as dotenv from "dotenv"
dotenv.config()

/**
 * Interface for DatasetsEvm containing specific methods.
 */
interface DatasetsEvm {
    getDatasetMetadata(id: number): Promise<EvmOutput<any>>
    getDatasetMetadataSubmitter(id: number): Promise<EvmOutput<string>>
    submitDatasetMetadata(...params: any[]): Promise<EvmOutput<any>>
}

//@ts-ignore
@withCallMethod(["getDatasetMetadata", "getDatasetMetadataSubmitter"])
//@ts-ignore
@withSendMethod(["submitDatasetMetadata"])
/**
 * Decorated class for DatasetsEvm implementation of Datasets.
 */
class DatasetsEvm extends Evm {}

/**
 * Instance of Web3Datasets initialized with provided configuration.
 */
export const web3Datasets = new DatasetsEvm(
    new Web3EvmEngine(
        DatasetsAbi.abi,
        process.env.DATASET_CONTRACT_ADDRESS as string,
        process.env.PROVIDER_URL as string
    )
)

/**
 * Instance of EthersDatasets initialized with provided configuration.
 */
export const ethersDatasets = new DatasetsEvm(
    new EthersEvmEngine(
        DatasetsAbi.abi,
        process.env.DATASET_CONTRACT_ADDRESS as string,
        process.env.PROVIDER_URL as string
    )
)
