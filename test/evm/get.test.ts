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

var assert = require("assert")
const { it } = require("mocha")
import { web3Datasets, ethersDatasets } from "./env/datasets"
import { datasetContractAddress, providerUrl } from "./env/constant"
import DatasetABI from "./testAbi/Datasets.json"
import { EvmType } from "../../src/evm/interface"

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

        assert.deepStrictEqual(web3Result, datasetContractAddress)
        assert.deepStrictEqual(ethersResult, datasetContractAddress)
    })

    it("getProviderUrl test", () => {
        const web3Result = web3Datasets.getProviderUrl()
        const ethersResult = ethersDatasets.getProviderUrl()

        assert.deepStrictEqual(web3Result, providerUrl)
        assert.deepStrictEqual(ethersResult, providerUrl)
    })
})
