/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under either the MIT License (the "MIT License") or the Apache License, Version 2.0
 *  (the "Apache License"). You may not use this file except in compliance with one of these
 *  licenses. You may obtain a copy of the MIT License at
 *
 *      https://opensource.org/licenses/MIT
 *
 *  Or the Apache License, Version 2.0 at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the MIT License or the Apache License for the specific language governing permissions and
 *  limitations under the respective licenses.
 ********************************************************************************/

import assert from "assert"
import { it } from "mocha"
import { Context } from "mocha"
import { web3Proof, ethersProof } from "./env/proof"
import * as dotenv from "dotenv"
dotenv.config()

const expectEventArgs = {
    ok: true,
    data: {
        datasetId: BigInt(1),
        provider: "0x3D08114dD4F65B5DDCc760884249D9d1AE435Dee",
    },
}

describe("Send(value),getEvmEventArgs,getTransaction,getTransactionReceipt test(By privateKey) ", () => {
    it("web3 correct test", async function (this: Context) {
        this.timeout(100000)
        web3Proof.getWallet().add(process.env.PROOFSUBMITTERKEY as string)
        const web3Result = await web3Proof.appendDatasetCollateral(1, {
            // from: process.env.PROOF_SUBMITTER,
            // privateKey: process.env.PROOFSUBMITTERKEY,
            value: web3Proof.generateWei("1", "gwei"),
        })
        const web3Tx = await web3Proof.getTransaction(
            web3Result.data.transactionHash
        )
        const web3Receipt = await web3Proof.getTransactionReceipt(
            web3Result.data.transactionHash
        )

        assert.deepStrictEqual(web3Result.ok, true)
        assert.deepStrictEqual(web3Tx?.value, BigInt(1000000000))
        assert.deepStrictEqual(web3Result.data, web3Receipt)

        const res = web3Proof.getEvmEventArgs(web3Receipt!, "CollateralEnough")
        assert.deepStrictEqual(res, expectEventArgs)
    })

    it("ethers correct test", async function (this: Context) {
        this.timeout(100000)

        ethersProof.getWallet().add(process.env.PROOFSUBMITTERKEY as string)
        const ethersResult = await ethersProof.appendDatasetCollateral(1, {
            // from: process.env.PROOF_SUBMITTER,
            // privateKey: process.env.PROOFSUBMITTERKEY,
            value: ethersProof.generateWei("1", "gwei"),
        })
        const ethersTx = await ethersProof.getTransaction(
            ethersResult.data.hash
        )
        const Receipt = await ethersProof.getTransactionReceipt(
            ethersResult.data.hash
        )

        assert.deepStrictEqual(ethersResult.ok, true)
        assert.deepStrictEqual(ethersTx?.value, BigInt(1000000000))
        assert.deepStrictEqual(ethersResult.data, Receipt)

        const res = ethersProof.getEvmEventArgs(Receipt!, "CollateralEnough")
        assert.deepStrictEqual(res, expectEventArgs)
    })
})
