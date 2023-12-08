var assert = require("assert")
const { it } = require("mocha")
import { web3Datasets, ethersDatasets } from "./env/datasets"

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
const incorrectTxInput =
    "0xc31e76710000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000001e84800000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000a5367757a46505851584e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a347373674f3836327a7500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a457758386353716d4d3900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a644d6e4658505550613300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a7452393954375947326c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4c4d32744d365157343800000000000000000000000000000000000000000000"

const functionName = "submitDatasetMetadata"
const functionNoInAbi = 32
const functionSignature = "0xa31e7671"

describe("Encoding and decoding test", () => {
    describe("decodeTxInput Test", () => {
        it("web3 correct test", () => {
            const web3Decode = web3Datasets.decodeTxInput(txInput)
            assert.deepStrictEqual(web3Decode, evmInput)
        })

        it("ethers correct test", () => {
            const ethersDecode = ethersDatasets.decodeTxInput(txInput)
            assert.deepStrictEqual(ethersDecode, evmInput)
        })

        it("web3 error test", () => {
            const web3Decode = web3Datasets.decodeTxInput(incorrectTxInput)

            const expected = {
                ok: false,
                error: "Not found function in ABI!",
            }

            assert.deepStrictEqual(web3Decode, expected)
        })

        it("ethers error test", () => {
            const decode = ethersDatasets.decodeTxInput(incorrectTxInput)
            assert.deepStrictEqual(decode.ok, false)
        })
    })

    describe("encodeEvmInputToTxinput test", () => {
        it("web3 correct test", () => {
            const web3Txinput = web3Datasets.encodeEvmInputToTxinput(
                evmInput.data
            )
            assert.deepStrictEqual(web3Txinput.data, txInput)
        })

        it("ethers correct test", () => {
            const ethersTxinput = ethersDatasets.encodeEvmInputToTxinput(
                evmInput.data
            )
            assert.deepStrictEqual(ethersTxinput.data, txInput)
        })
    })

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
