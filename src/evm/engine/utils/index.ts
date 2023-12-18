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

import { Result } from "@unipackage/utils"
import { JsonFragment } from "ethers"
import { AbiFunctionFragment } from "web3"

/**
 * Represents a parsed data object.
 * The keys are string representations, and the values can be of any type.
 */
export type EvmReplyData = {
    [key: string]: any
}

/**
 * Converts the output array of a function call to an object using ABI and method name.
 *
 * @param abi An array containing fragments (AbiFunctionFragment or JsonFragment).
 * @param name The name of the method to search for.
 * @param type The type of the method to search for.
 * @param data The output array of a function call.
 * @param isInputs true:inputs,false:output
 * @returns The converted object. Returns undefined if the output array is empty, or the single element if there's only one.
 * @throws Throws an error if the ABI function fragment is undefined.
 */
export function convertArrayToObjectByAbiAndName(
    abi: AbiFunctionFragment[] | JsonFragment[],
    type: string,
    name: string,
    data: any[],
    isInputs?: boolean
): any {
    const abiFragment = getAbiFragmentByMethodName(abi, type, name)
    if (!abiFragment) {
        throw new Error("Abi function fragment is undefined")
    }
    return convertArrayToObjectByAbiFragment(abiFragment, data, isInputs)
}

/**
 * Converts the output array of a function call to an object.
 *
 * @param abi The ABI information of the function, including the output parameters.
 * @param data The output array of a function call.
 * @param isInputs true:inputs,false:output
 * @returns The converted object. Returns undefined if the output array is empty, or the single element if there's only one.
 */
export function convertArrayToObjectByAbiFragment(
    abi: AbiFunctionFragment | JsonFragment,
    data: any[],
    isInputs?: boolean
): any {
    const inputsOrOutputs = isInputs ? abi.inputs : abi.outputs
    if (!inputsOrOutputs) {
        throw new Error(
            `convertArrayToObjectByAbiFunctionFragment:Outputs of abi fragment undefined!`
        )
    }
    if (inputsOrOutputs.length !== data.length) {
        throw new Error(
            `The length of ${JSON.stringify(data)} and ${JSON.stringify(
                inputsOrOutputs
            )} is not matched`
        )
    }
    const length = data.length

    if (length === 0) {
        return undefined
    } else if (length === 1) {
        return data[0]
    } else {
        const result: any = {}
        data.forEach((value, index) => {
            if (inputsOrOutputs[index].name) {
                result[inputsOrOutputs[index].name!.replace(/^_+/, "")] = value
            } else {
                result[`unnameKey+${index}`] = value
            }
        })
        return result
    }
}

/**
 * Retrieves a fragment from the ABI based on the method name.
 *
 * @param abi An array containing fragments (AbiFunctionFragment or JsonFragment).
 * @param name The name of the method to search for.
 * @param type The type of the method to search for.
 * @returns The matching AbiFunctionFragment or JsonFragment object, or undefined if not found.
 */
export function getAbiFragmentByMethodName(
    abi: AbiFunctionFragment[] | JsonFragment[],
    type: string,
    name: string
): AbiFunctionFragment | JsonFragment | undefined {
    return abi.find((method) => {
        return method.type === type && method.name === name
    })
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
