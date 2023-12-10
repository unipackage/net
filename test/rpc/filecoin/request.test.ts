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
const { it } = require("mocha")
import { chainRPC } from "./env/index"

//@ts-ignore
describe("filecoin rpc test", () => {
    it("correct test", async () => {
        const chainHead = await chainRPC.ChainHead()
        assert.deepStrictEqual(chainHead.ok, true)
        if (chainHead.ok) {
            const tipset = await chainRPC.ChainGetTipSetByHeight(
                chainHead.data.Height,
                chainHead.data.Cids
            )
            assert.deepStrictEqual(tipset.ok, true)
            if (tipset.ok) {
                assert.deepStrictEqual(chainHead.data, tipset.data)
            }
        }
    })
})
