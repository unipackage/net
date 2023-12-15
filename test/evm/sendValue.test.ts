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
import Web3 from "web3"
import * as dotenv from "dotenv"
dotenv.config()

describe("SendValue test(By privateKey) ", () => {
    it("web3 correct test", async function (this: Context) {
        this.timeout(100000)

        const web3Result = await web3Proof.appendDatasetCollateral(1, {
            from: process.env.PROOF_SUBMITTER,
            privateKey: process.env.PROOFSUBMITTERKEY,
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
            from: process.env.PROOF_SUBMITTER,
            privateKey: process.env.PROOFSUBMITTERKEY,
            value: ethersProof.generateWei("1", "gwei"),
        })
        const ethersTx = await ethersProof.getEtherProvider()?.getTransaction(
            ethersResult.data.hash
        )
        assert.deepStrictEqual(ethersResult.ok, true)
        assert.deepStrictEqual(ethersTx?.value, BigInt(1000000000))
    })
})
