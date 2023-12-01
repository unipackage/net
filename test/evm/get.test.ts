var assert = require("assert")
const { it } = require("mocha")
import { datasets } from "./env/datasets"
import { datasetContractAddress, providerUrl } from "./env/constant"
import DatasetABI from "./testAbi/Datasets.json"

describe("Get test", () => {
    it("getWeb3 test", () => {
        const result = datasets.getWeb3()
        assert.deepStrictEqual(result !== null && result !== undefined, true)
    })

    it("getContract test", () => {
        const result = datasets.getContract()
        assert.deepStrictEqual(result !== null && result !== undefined, true)
    })
    it("getContractABI test", () => {
        const result = datasets.getContractABI()
        assert.deepStrictEqual(result, DatasetABI.abi)
    })
    it("getContractAddress test", () => {
        const result = datasets.getContractAddress()
        assert.deepStrictEqual(result, datasetContractAddress)
    })
    it("getProviderUrl test", () => {
        const result = datasets.getProviderUrl()
        console.log(result)
        assert.deepStrictEqual(result, providerUrl)
    })
})
