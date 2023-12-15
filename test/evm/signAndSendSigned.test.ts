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
import { Web3 } from "web3"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import { web3Proof, ethersProof } from "./env/proof"
import * as dotenv from "dotenv"
dotenv.config()

describe("Sign and sendSigned test(By privateKey) ", () => {
    it("web3 correct test", async function (this: Context) {
        this.timeout(100000)
        const signed = await web3Proof.sign(
            { method: "appendDatasetCollateral", params: [1] },
            {
                from: process.env.PROOF_SUBMITTER,
                privateKey: process.env.PROOFSUBMITTERKEY,
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
                from: process.env.PROOF_SUBMITTER,
                privateKey: process.env.PROOFSUBMITTERKEY,
                value: ethersProof.generateWei("1", "gwei"),
            }
        )
        const result = await ethersProof.sendSigned(signed.data!)
        const tx = await ethersProof.getEtherProvider()?.getTransaction(
            result.data.hash
        )
        assert.deepStrictEqual(result.ok, true)
        assert.deepStrictEqual(tx?.value, BigInt(1000000000))
    })
})
