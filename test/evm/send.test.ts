var assert = require("assert")
import { Context } from "mocha"
const { it } = require("mocha")
import { web3Datasets, ethersDatasets } from "./env/datasets"
import { generateRandomString } from "../tools/utils/randomString"
import { metadataSubmitter, metadataSubmitterKey } from "./env/constant"

describe("Send test(By privateKey)", () => {
    it("web3 correct test", async function (this: Context) {
        this.timeout(100000)
        const data = [
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            512000000,
            true,
            1,
            {
                from: metadataSubmitter,
                privateKey: metadataSubmitterKey,
            },
        ]

        const web3Result = await web3Datasets.submitDatasetMetadata(...data)

        if (web3Result.ok) {
            assert.deepStrictEqual(web3Result.ok, true)
        } else {
            assert.deepStrictEqual(
                web3Result.error.includes(
                    "failed to check balance: not enough funds"
                ),
                true
            )
        }
    })

    it("ethers correct test", async function (this: Context) {
        this.timeout(100000)
        const data = [
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            512000000,
            true,
            1,
            {
                from: metadataSubmitter,
                privateKey: metadataSubmitterKey,
            },
        ]

        const ethersResult = await ethersDatasets.submitDatasetMetadata(...data)

        if (ethersResult.ok) {
            assert.deepStrictEqual(ethersResult.ok, true)
        } else {
            assert.deepStrictEqual(
                ethersResult.error.includes(
                    "failed to check balance: not enough funds"
                ),
                true
            )
        }
    })
})
