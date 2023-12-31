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

import assert from "assert"
import { it } from "mocha"
import { web3Datasets, ethersDatasets } from "./env/datasets"
import DatasetABI from "./testAbi/Datasets.json"
import { EvmType } from "../../src/evm/interface"
import * as dotenv from "dotenv"
dotenv.config()

//@ts-ignore
describe("Get test", () => {
    it("getWeb3 test", () => {
        const web3Result = web3Datasets.getWeb3()
        const ethersResult = ethersDatasets.getWeb3()

        assert.deepStrictEqual(
            web3Result !== null && web3Result !== undefined,
            true
        )
        assert.deepStrictEqual(ethersResult === null, true)
    })

    it("getEthersProvider test", () => {
        const web3Result = web3Datasets.getEtherProvider()
        const ethersResult = ethersDatasets.getEtherProvider()

        assert.deepStrictEqual(
            ethersResult !== null && ethersResult !== undefined,
            true
        )
        assert.deepStrictEqual(web3Result === null, true)
    })

    it("getContract test", () => {
        const web3Result = web3Datasets.getContract()
        const ethersResult = ethersDatasets.getContract()

        assert.deepStrictEqual(
            web3Result !== null && web3Result !== undefined,
            true
        )
        assert.deepStrictEqual(
            ethersResult !== null && ethersResult !== undefined,
            true
        )
    })

    it("getEvmType test", () => {
        const web3Result = web3Datasets.getEvmType()
        const ethersResult = ethersDatasets.getEvmType()

        assert.deepStrictEqual(web3Result, EvmType.Web3)
        assert.deepStrictEqual(ethersResult, EvmType.Ethers)
    })

    it("getContractABI test", () => {
        const web3Result = web3Datasets.getContractABI()
        const ethersResult = ethersDatasets.getContractABI()

        assert.deepStrictEqual(web3Result, DatasetABI.abi)
        assert.deepStrictEqual(ethersResult, DatasetABI.abi)
    })

    it("getContractAddress test", () => {
        const web3Result = web3Datasets.getContractAddress()
        const ethersResult = ethersDatasets.getContractAddress()

        assert.deepStrictEqual(web3Result, process.env.DATASET_CONTRACT_ADDRESS)
        assert.deepStrictEqual(
            ethersResult,
            process.env.DATASET_CONTRACT_ADDRESS
        )
    })

    it("getProviderUrl test", () => {
        const web3Result = web3Datasets.getProviderUrl()
        const ethersResult = ethersDatasets.getProviderUrl()

        assert.deepStrictEqual(web3Result, process.env.PROVIDER_URL)
        assert.deepStrictEqual(ethersResult, process.env.PROVIDER_URL)
    })
})
