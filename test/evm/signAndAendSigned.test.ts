var assert = require("assert")
import { Web3 } from "web3"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { Context } from "mocha"
const { it } = require("mocha")
import { web3Proof, ethersProof } from "./env/proof"
import { proofSubmitter, proofSubmitterKey } from "./env/constant"

describe("Sign and sendSigned test(By privateKey) ", () => {
    it("web3 correct test", async function (this: Context) {
        this.timeout(100000)
        const signed = await web3Proof.sign(
            { method: "appendDatasetCollateral", params: [1] },
            {
                from: proofSubmitter,
                privateKey: proofSubmitterKey,
                value: web3Proof.generateWei("1", "gwei"),
            }
        )
        const result = await web3Proof.sendSigned(signed.data as Web3Signature)
        const tx = await (web3Proof.getWeb3() as Web3).eth.getTransaction(
            result.data.transactionHash
        )
        assert.deepStrictEqual(result.ok, true)
        assert.deepStrictEqual(tx.value, BigInt(1000000000))
    })

    it("ethers correct test", async function (this: Context) {
        this.timeout(100000)
        const signed = await ethersProof.sign(
            { method: "appendDatasetCollateral", params: [1] },
            {
                from: proofSubmitter,
                privateKey: proofSubmitterKey,
                value: ethersProof.generateWei("1", "gwei"),
            }
        )
        const result = await ethersProof.sendSigned(signed.data!)
        assert.deepStrictEqual(result.ok, true)
        assert.deepStrictEqual(result.data.value, BigInt(1000000000))
    })
})
