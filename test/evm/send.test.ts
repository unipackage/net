var assert = require("assert")
import { Context } from "mocha"
const { it } = require("mocha")
import { datasets } from "./env/datasets"
import { generateRandomString } from "../tools/utils/randomString"
import { metadataSubmitter, metadataSubmitterKey } from "./env/constant"

describe("Send test(By privateKey)", () => {
    it("correct test", async function (this: Context) {
        this.timeout(100000)
        const result = await datasets.submitDatasetMetadata(
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
            }
        )
        assert.deepStrictEqual(result.ok, true)
    })
})
