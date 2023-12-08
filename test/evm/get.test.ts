var assert = require("assert")
const { it } = require("mocha")
import { web3Datasets, ethersDatasets } from "./env/datasets"
import { datasetContractAddress, providerUrl } from "./env/constant"
import DatasetABI from "./testAbi/Datasets.json"
import { EvmType } from "../../src/evm/interface"

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
