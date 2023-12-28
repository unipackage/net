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
import { JsonFragment, Result as EhtersResult } from "ethers"
import { AbiFunctionFragment } from "web3"
import { EvmTransactionOptions } from "../../interface"
import { IWallet } from "../../interface/wallet"

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

    const length = inputsOrOutputs.length
    if (length === 0 || data.length === 0) {
        return undefined
    } else if (
        length === 1 &&
        (inputsOrOutputs[0].type?.includes("[]") ||
            inputsOrOutputs[0].type?.includes("array"))
    ) {
        return data // For single array parameter
    } else {
        if (inputsOrOutputs.length !== data.length) {
            throw new Error(
                `The length of ${JSON.stringify(data)} and ${JSON.stringify(
                    inputsOrOutputs
                )} is not matched`
            )
        }
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

/**
 * Retrieves the address from which the transaction should originate.
 *
 * If the `options.from` field is provided, it returns that address.
 * Otherwise, it attempts to retrieve the default address from the provided wallet.
 *
 * @param wallet - The wallet from which to retrieve the default address.
 * @param options - Transaction options that may contain the `from` address.
 * @returns The address from which the transaction should originate.
 */
export function getFromAddress(
    wallet: IWallet,
    options?: EvmTransactionOptions
): string {
    let result: string
    const fromResult = wallet && wallet.getDefault()
    if (!options || !options.from) {
        if (!fromResult || !fromResult.ok || !fromResult.data) {
            return ""
        } else {
            result = fromResult.data.address
        }
    } else {
        result = options.from
    }
    return result
}

/**
 * Retrieves the private key corresponding to the address from which the transaction should originate.
 *
 * If the `options.privateKey` field is provided, it returns that private key.
 * Otherwise, it attempts to retrieve the private key corresponding to the default address from the provided wallet.
 *
 * @param wallet - The wallet from which to retrieve the default address and its corresponding private key.
 * @param options - Transaction options that may contain the `privateKey` or `from` address.
 * @returns The private key corresponding to the address from which the transaction should originate.
 */
export function getFromPrivateKey(
    wallet: IWallet,
    options?: EvmTransactionOptions
): string {
    let result: string
    const fromResult = wallet && wallet.getDefault()
    if (!options || !options.privateKey || !options.from) {
        if (!fromResult || !fromResult.ok || !fromResult.data) {
            return ""
        } else {
            result = fromResult.data.privateKey
        }
    } else {
        result = options.privateKey
    }
    return result
}

/**
 * Recursively converts an object of type Result from the ethers package to a plain array.
 * @param {any} result - The object to be converted.
 * @returns {any} - The converted object.
 */
export function unwrapEthersResult(result: any): any {
    if (result instanceof EhtersResult) {
        result = result.toArray()
        return result.map(unwrapEthersResult)
    } else {
        return result
    }
}
