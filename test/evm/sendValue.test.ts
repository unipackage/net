var assert = require("assert")
import { Context } from "mocha"
const { it } = require("mocha")
import { web3Proof, ethersProof } from "./env/proof"
import { proofSubmitter, proofSubmitterKey } from "./env/constant"
import Web3 from "web3"

describe("SendValue test(By privateKey) ", () => {
    it("web3 correct test", async function (this: Context) {
        this.timeout(100000)

        const web3Result = await web3Proof.appendDatasetCollateral(1, {
            from: proofSubmitter,
            privateKey: proofSubmitterKey,
            value: web3Proof.generateWei("1", "gwei"),
        })
        const web3Tx = await (web3Proof.getWeb3() as Web3).eth.getTransaction(
            web3Result.data.transactionHash
        )
        assert.deepStrictEqual(web3Result.ok, true)
        assert.deepStrictEqual(web3Tx.value, BigInt(1000000000))
    })

    it("ethers correct test", async function (this: Context) {
        this.timeout(100000)

        const ethersResult = await ethersProof.appendDatasetCollateral(1, {
            from: proofSubmitter,
            privateKey: proofSubmitterKey,
            value: ethersProof.generateWei("1", "gwei"),
        })
        assert.deepStrictEqual(ethersResult.ok, true)
        assert.deepStrictEqual(ethersResult.data.value, BigInt(1000000000))
    })
})
