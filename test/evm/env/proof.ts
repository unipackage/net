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

import DatasetProofAbi from "../testAbi/DatasetsProof.json"
import { Web3Evm } from "../../../src/evm/implements/web3"
import { EthersEvm } from "../../../src/evm/implements/ether"
import { EvmOutput } from "../../../src/evm/interface"
import { withSendMethod } from "../../../src/evm/withMethod"
import * as dotenv from "dotenv"
dotenv.config()

/**
 * Interface for Web3Proof containing specific methods.
 */
interface Web3Proof {
    appendDatasetCollateral(...params: any[]): Promise<EvmOutput<any>>
}

//@ts-ignore
@withSendMethod(["appendDatasetCollateral"])
/**
 * Decorated class for Web3Evm implementation of Proof.
 */
class Web3Proof extends Web3Evm {}

/**
 * Instance of Web3Proof initialized with provided configuration.
 */
export const web3Proof = new Web3Proof(
    DatasetProofAbi.abi,
    process.env.PROOF_CONTRACT_ADDRESS as string,
    process.env.PROVIDER_URL as string
)

/**
 * Interface for EthersProof containing specific methods.
 */
interface EthersProof {
    appendDatasetCollateral(...params: any[]): Promise<EvmOutput<any>>
}

//@ts-ignore
@withSendMethod(["appendDatasetCollateral"])
/**
 * Decorated class for EthersEvm implementation of Proof.
 */
class EthersProof extends EthersEvm {}

/**
 * Instance of EthersProof initialized with provided configuration.
 */
export const ethersProof = new EthersProof(
    DatasetProofAbi.abi,
    process.env.PROOF_CONTRACT_ADDRESS as string,
    process.env.PROVIDER_URL as string
)
