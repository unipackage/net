/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under the GNU General Public License, Version 3.0 or later (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/

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
