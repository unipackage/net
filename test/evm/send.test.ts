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

import assert from "assert"
import { it } from "mocha"
import { Context } from "mocha"
import { web3Datasets, ethersDatasets } from "./env/datasets"
import { generateRandomString } from "../tools/utils/randomString"
import { metadataSubmitter } from "./env/constant"

describe("Send test(By privateKey)", () => {
    it("web3 correct test", async function (this: Context) {
        this.timeout(100000)
        const data = [
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            512000000,
            true,
            1,
            {
                from: metadataSubmitter,
                privateKey: process.env.METADATASUBMITTERKEY,
            },
        ]

        const web3Result = await web3Datasets.submitDatasetMetadata(...data)

        if (web3Result.ok) {
            assert.deepStrictEqual(web3Result.ok, true)
        } else {
            assert.deepStrictEqual(
                web3Result.error.includes(
                    "failed to check balance: not enough funds"
                ),
                true
            )
        }
    })

    it("ethers correct test", async function (this: Context) {
        this.timeout(100000)
        const data = [
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            generateRandomString(10),
            512000000,
            true,
            1,
            {
                from: metadataSubmitter,
                privateKey: process.env.METADATASUBMITTERKEY,
            },
        ]

        const ethersResult = await ethersDatasets.submitDatasetMetadata(...data)

        if (ethersResult.ok) {
            assert.deepStrictEqual(ethersResult.ok, true)
        } else {
            assert.deepStrictEqual(
                ethersResult.error.includes(
                    "failed to check balance: not enough funds"
                ),
                true
            )
        }
    })
})
