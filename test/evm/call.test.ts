var assert = require("assert")
const { it } = require("mocha")
import { web3Datasets, ethersDatasets } from "./env/datasets"

const expectedMeta = {
    ok: true,
    data: [
        "test-sirius",
        "my industry",
        "hi siri",
        "desc good data set",
        "aws://sdfa.com",
        "dataswap.com/test1",
        "0x15B2896f76Cee4E2C567e7bC671bB701D7339B30",
        BigInt(1084025),
        BigInt(512000000),
        true,
        BigInt(1),
    ],
}

const expectedSubmitter = {
    ok: true,
    data: "0x15B2896f76Cee4E2C567e7bC671bB701D7339B30",
}

describe("Call test", () => {
    it("web3 correct test", async () => {
        const web3Meta = await web3Datasets.getDatasetMetadata(1)
        const web3Submmiter = await web3Datasets.getDatasetMetadataSubmitter(1)

        assert.deepStrictEqual(web3Meta, expectedMeta)
        assert.deepStrictEqual(web3Submmiter, expectedSubmitter)
    })

    it("ethers correct test", async () => {
        const ethersMeta = await ethersDatasets.getDatasetMetadata(1)
        const ethersSubmmiter =
            await ethersDatasets.getDatasetMetadataSubmitter(1)

        assert.deepStrictEqual(ethersMeta, expectedMeta)
        assert.deepStrictEqual(ethersSubmmiter, expectedSubmitter)
    })
})
