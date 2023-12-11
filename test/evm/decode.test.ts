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
import { web3Datasets, ethersDatasets } from "./env/datasets"
import { web3Proof, ethersProof } from "./env/proof"

const txInput =
    "0xa31e76710000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000001e84800000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000a5367757a46505851584e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a347373674f3836327a7500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a457758386353716d4d3900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a644d6e4658505550613300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a7452393954375947326c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4c4d32744d365157343800000000000000000000000000000000000000000000"

const evmInput = {
    ok: true,
    data: {
        method: "submitDatasetMetadata",
        params: [
            "SguzFPXQXN",
            "4ssgO862zu",
            "EwX8cSqmM9",
            "dMnFXPUPa3",
            "tR99T7YG2l",
            "LM2tM6QW48",
            BigInt(512000000),
            true,
            BigInt(1),
        ],
    },
}

const txInputOnlyOneParam =
    "0x38835e730000000000000000000000000000000000000000000000000000000000000001"

const evmInputOnlyOneParam = {
    ok: true,
    data: {
        method: "appendDatasetCollateral",
        params: [BigInt(1)],
    },
}
const incorrectTxInput =
    "0xc31e76710000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000001e84800000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000a5367757a46505851584e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a347373674f3836327a7500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a457758386353716d4d3900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a644d6e4658505550613300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a7452393954375947326c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4c4d32744d365157343800000000000000000000000000000000000000000000"

const functionName = "submitDatasetMetadata"
const functionNoInAbi = 32
const functionSignature = "0xa31e7671"

//@ts-ignore
describe("Encoding and decoding test", () => {
    //@ts-ignore
    describe("decodeTxInput Test", () => {
        it("web3 correct test(multi params)", () => {
            const web3Decode = web3Datasets.decodeTxInputToEvmInput(txInput)
            assert.deepStrictEqual(web3Decode, evmInput)
        })

        it("web3 correct test(one param)", () => {
            const web3Decode =
                web3Proof.decodeTxInputToEvmInput(txInputOnlyOneParam)
            assert.deepStrictEqual(web3Decode, evmInputOnlyOneParam)
        })

        it("ethers correct test(multi params)", () => {
            const ethersDecode = ethersDatasets.decodeTxInputToEvmInput(txInput)
            assert.deepStrictEqual(ethersDecode, evmInput)
        })

        it("ethers correct test(one param)", () => {
            const ethersDecode =
                ethersProof.decodeTxInputToEvmInput(txInputOnlyOneParam)
            assert.deepStrictEqual(ethersDecode, evmInputOnlyOneParam)
        })

        it("web3 error test", () => {
            const web3Decode =
                web3Datasets.decodeTxInputToEvmInput(incorrectTxInput)

            const expected = {
                ok: false,
                error: "Not found function in ABI!",
            }

            assert.deepStrictEqual(web3Decode, expected)
        })

        it("ethers error test", () => {
            const decode =
                ethersDatasets.decodeTxInputToEvmInput(incorrectTxInput)
            assert.deepStrictEqual(decode.ok, false)
        })
    })

    //@ts-ignore
    describe("encodeEvmInputToTxinput test", () => {
        it("web3 correct test(multi params)", () => {
            const web3Txinput = web3Datasets.encodeEvmInputToTxinput(
                evmInput.data
            )
            assert.deepStrictEqual(web3Txinput.data, txInput)
        })

        it("web3 correct test(one param)", () => {
            const web3Txinput = web3Proof.encodeEvmInputToTxinput(
                evmInputOnlyOneParam.data
            )
            assert.deepStrictEqual(web3Txinput.data, txInputOnlyOneParam)
        })

        it("ethers correct test(multi params)", () => {
            const ethersTxinput = ethersDatasets.encodeEvmInputToTxinput(
                evmInput.data
            )
            assert.deepStrictEqual(ethersTxinput.data, txInput)
        })

        it("ethers correct test(one param)", () => {
            const ethersTxinput = ethersProof.encodeEvmInputToTxinput(
                evmInputOnlyOneParam.data
            )
            assert.deepStrictEqual(ethersTxinput.data, txInputOnlyOneParam)
        })
    })

    //@ts-ignore
    describe("encodeFunctionSignatureByAbi test", () => {
        it("web3 correct test", () => {
            const web3FunctionSignature =
                web3Datasets.encodeFunctionSignatureByAbi(
                    web3Datasets.getContractABI()[functionNoInAbi]
                )

            assert.deepStrictEqual(
                web3FunctionSignature.data,
                functionSignature
            )
        })

        it("ethers correct test", () => {
            const ethersFunctionSignature =
                ethersDatasets.encodeFunctionSignatureByAbi(
                    ethersDatasets.getContractABI()[functionNoInAbi]
                )

            assert.deepStrictEqual(
                ethersFunctionSignature.data,
                functionSignature
            )
        })
    })

    //@ts-ignore
    describe("encodeFunctionSignatureByFunctionName test", () => {
        it("web3 correct test", () => {
            const web3FunctionSignature =
                web3Datasets.encodeFunctionSignatureByFuntionName(functionName)
            assert.deepStrictEqual(
                web3FunctionSignature.data,
                functionSignature
            )
        })

        it("ethers correct test", () => {
            const ethersFunctionSignature =
                ethersDatasets.encodeFunctionSignatureByFuntionName(
                    functionName
                )

            assert.deepStrictEqual(
                ethersFunctionSignature.data,
                functionSignature
            )
        })
    })
})
