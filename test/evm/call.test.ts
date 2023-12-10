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
import { web3Datasets, ethersDatasets } from "./env/datasets"

const expectedMeta = {
    ok: true,
    data: [
        "test-sirius",
        "my industry",
        "hi siri",
        "desc good data set",
        "aws://sdfa.com",
        "dataswap.com/test1",
        "0x15B2896f76Cee4E2C567e7bC671bB701D7339B30",
        BigInt(1084025),
        BigInt(512000000),
        true,
        BigInt(1),
    ],
}

const expectedSubmitter = {
    ok: true,
    data: "0x15B2896f76Cee4E2C567e7bC671bB701D7339B30",
}

//@ts-ignore
describe("Call test", () => {
    it("web3 correct test", async () => {
        const web3Meta = await web3Datasets.getDatasetMetadata(1)
        const web3Submmiter = await web3Datasets.getDatasetMetadataSubmitter(1)

        assert.deepStrictEqual(web3Meta, expectedMeta)
        assert.deepStrictEqual(web3Submmiter, expectedSubmitter)
    })

    it("ethers correct test", async () => {
        const ethersMeta = await ethersDatasets.getDatasetMetadata(1)
        const ethersSubmmiter =
            await ethersDatasets.getDatasetMetadataSubmitter(1)

        assert.deepStrictEqual(ethersMeta, expectedMeta)
        assert.deepStrictEqual(ethersSubmmiter, expectedSubmitter)
    })
})
