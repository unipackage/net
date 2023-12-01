var assert = require("assert")
import { Context } from "mocha"
const { it } = require("mocha")
import { proof } from "./env/proof"
import { proofSubmitter, proofSubmitterKey } from "./env/constant"
import Web3 from "web3"

describe("SendValue test ", () => {
    it("correct test", async function (this: Context) {
        this.timeout(100000)
        const result = await proof.appendDatasetCollateral(1, {
            from: proofSubmitter,
            privateKey: proofSubmitterKey,
            value: (proof.getWeb3() as Web3).utils.toWei("1", "gwei"),
        })
        const tx = await (proof.getWeb3() as Web3).eth.getTransaction(
            result.data.transactionHash
        )
        assert.deepStrictEqual(result.ok, true)
        assert.deepStrictEqual(tx.value, BigInt(1000000000))
    })
})
