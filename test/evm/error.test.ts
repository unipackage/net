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
import { web3Datasets, ethersDatasets } from "./env/datasets"
import { generateRandomString } from "../tools/utils/randomString"
import * as dotenv from "dotenv"
dotenv.config()

describe.only("Send test(By privateKey)", () => {
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
                from: process.env.METADATA_SUBMITTER,
                privateKey: process.env.METADATASUBMITTERKEY,
                value:web3Datasets.generateWei("10000","ether")
            },
        ]

        const web3Result = await web3Datasets.submitDatasetMetadata(...data)
        assert.equal(web3Result.ok,false)
        assert.ok((web3Result.error as String).includes("SysErrInsufficientFunds"))
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
                from: process.env.METADATA_SUBMITTER,
                privateKey: process.env.METADATASUBMITTERKEY,
                value:web3Datasets.generateWei("10000","ether")
            },
        ]

        const ethersResult = await ethersDatasets.submitDatasetMetadata(...data)

        assert.equal(ethersResult.ok,false)
        assert.ok((ethersResult.error as String).includes("SysErrInsufficientFunds"))
    })
})
