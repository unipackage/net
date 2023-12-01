var assert = require("assert")
import { Web3 } from "web3"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { Context } from "mocha"
const { it } = require("mocha")
import { proof } from "./env/proof"
import { proofSubmitter, proofSubmitterKey } from "./env/constant"

describe("Sign and sendSigned test ", () => {
    it("correct test", async function (this: Context) {
        this.timeout(100000)
        const signed = await proof.sign(
            { method: "appendDatasetCollateral", params: [1] },
            {
                from: proofSubmitter,
                privateKey: proofSubmitterKey,
                value: (proof.getWeb3() as Web3).utils.toWei("1", "gwei"),
            }
        )
        const result = await proof.sendSigned(signed.data as Web3Signature)
        const tx = await (proof.getWeb3() as Web3).eth.getTransaction(
            result.data.transactionHash
        )
        assert.deepStrictEqual(result.ok, true)
        assert.deepStrictEqual(tx.value, BigInt(1000000000))
    })
})
