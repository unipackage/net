var assert = require("assert")
const { it } = require("mocha")
import { datasets } from "./env/datasets"

describe("Call test", () => {
    it("correct test", async () => {
        const meta = await datasets.getDatasetMetadata(1)

        const expected = {
            ok: true,
            data: {
                title: "test-sirius",
                industry: "my industry",
                name: "hi siri",
                description: "desc good data set",
                source: "aws://sdfa.com",
                accessMethod: "dataswap.com/test1",
                submitter: "0x15B2896f76Cee4E2C567e7bC671bB701D7339B30",
                createdBlockNumber: BigInt(1084025),
                sizeInBytes: BigInt(512000000),
                isPublic: true,
                version: BigInt(1),
            },
        }

        assert.deepStrictEqual(meta, expected)
    })
})
