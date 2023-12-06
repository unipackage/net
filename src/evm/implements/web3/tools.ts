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
import { Result } from "@unipackage/utils"

/**
 * Represents a parsed data object.
 * The keys are string representations, and the values can be of any type.
 */
export type EvmReplyData = {
    [key: string]: any
}

/**
 * Gets the encoded parameters from the transaction input.
 *
 * @param txInput - The transaction input.
 * @returns Result object with the encoded parameters.
 */
export function getEncodedParamsFromTxinput(txInput: string): Result<string> {
    try {
        if (txInput.length <= 10) {
            throw new Error("Invalid input length")
        }
        const params = "0x" + txInput.slice(10)
        return {
            ok: true,
            data: params,
        }
    } catch (error) {
        return {
            ok: false,
            error: error,
        }
    }
}

/**
 * Gets the function signatureFromInput from the transaction input.
 *
 * @param txInput - The transaction input.
 * @returns Result object with the encoded function name.
 */
export function getFunctionSignatureFromTxinput(
    txInput: string
): Result<string> {
    try {
        if (txInput.length < 10) {
            throw new Error("Invalid input length")
        }
        const functionSignature = txInput.slice(0, 10)
        return {
            ok: true,
            data: functionSignature,
        }
    } catch (error) {
        return {
            ok: false,
            error: error,
        }
    }
}

/**
 * Parse data object.
 *
 * @param data - The data object.
 * @returns Parsed data as a record.
 */
export function parseEvmReplyData(data: any): Array<any> | any {
    const result: Array<any> = []

    let count = 0
    let dataMap = data as EvmReplyData
    for (const prop in dataMap) {
        if (!isNaN(parseInt(prop)) || prop === "__length__") {
            continue
        }
        result.push(data[prop])
        count++
    }

    if (count == 0) {
        return data
    }

    return result
}
