var assert = require("assert")
const { it } = require("mocha")
import { datasets } from "./env/datasets"

describe("Call test", () => {
    it("correct test", async () => {
        const meta = await datasets.getDatasetMetadata(1)

        const expected = {
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
            ]
        }

        assert.deepStrictEqual(meta, expected)
    })
})
