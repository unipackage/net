import { Web3 } from "web3"
import { SignTransactionResult as Web3Signature } from "web3-eth-accounts"
import DatasetsAbi from "./Datasets.json"
import DatasetProofAbi from "./DatasetsProof.json"
import { Web3Evm } from "../"
import { withMethods } from "../../shared/withMethods"
import { EvmOutput, isEvmTransactionOptions } from "../interface"

function generateRandomString(length: number) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

interface Datasets {
    getDatasetMetadata(id: number): Promise<EvmOutput<any>>
    submitDatasetMetadata(...parmas: any[]): Promise<EvmOutput<any>>
}
@withMethods(["getDatasetMetadata"], "call")
@withMethods(["submitDatasetMetadata"], "send", isEvmTransactionOptions)
class Datasets extends Web3Evm {}

interface Proof {
    appendDatasetCollateral(...parmas: any[]): Promise<EvmOutput<any>>
}
@withMethods(["appendDatasetCollateral"], "send", isEvmTransactionOptions)
class Proof extends Web3Evm {}

describe("Web3 Evm Engine Test", () => {
    const providerUrl = "https://api.calibration.node.glif.io/rpc/v1"

    const datasetContractAddress = "0xfE63eA58F3935809b574007a34d9298d61af8557"
    const metadataSubmitter = "0x15B2896f76Cee4E2C567e7bC671bB701D7339B30"
    const metadataSubmitterKey =
        "0x0904cdc9c54d32fd7bef4ac225dabfd5d7aeafeaa118ba5e2da8f8b4f36012a1"

    const proofContractAddress = "0x25bF0135646E4ae1A19977F4A47D4C3f72B37994"
    const proofSubmitter = "0x3D08114dD4F65B5DDCc760884249D9d1AE435Dee"
    const proofSubmitterKey =
        "0xe624c69077cfea8e36bf4f1a1383ad4555f2f52f2d34abfe54c0918b8d843099"

    const datasets = new Datasets(
        DatasetsAbi.abi,
        datasetContractAddress,
        providerUrl
    )

    const proof = new Proof(
        DatasetProofAbi.abi,
        proofContractAddress,
        providerUrl
    )

    beforeAll(() => {})

    it("decode test", () => {
        const decode = datasets.decodeTxInput(
            "0xa31e76710000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000001e84800000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000a5367757a46505851584e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a347373674f3836327a7500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a457758386353716d4d3900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a644d6e4658505550613300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a7452393954375947326c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4c4d32744d365157343800000000000000000000000000000000000000000000"
        )
        console.log(decode.data.params)
    }, 100000)

    it("call test", async () => {
        const metadata = await datasets.getDatasetMetadata(1)
        console.log(metadata)
    }, 10000)

    it("send(By privateKey) Test", async () => {
        const result = await datasets.submitDatasetMetadata(
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
                privateKey: metadataSubmitterKey,
            }
        )
        console.log(result)

        // const web3 = datasets.getWeb3Object() as Web3
        // const tx = await web3.eth.getTransaction(result.data.transactionHash)
        // const decode = datasets.decodeTxInput(tx.input)
        // console.log(decode)
    }, 100000)

    it("transfer test", async () => {
        const result = await proof.appendDatasetCollateral(1, {
            from: proofSubmitter,
            privateKey: proofSubmitterKey,
            value: (proof.getWeb3Object() as Web3).utils.toWei("1", "gwei"),
        })
        console.log(result)
    }, 100000)

    it("sign and sendSigned", async () => {
        const signed = await proof.sign(
            { method: "appendDatasetCollateral", params: [1] },
            {
                from: proofSubmitter,
                privateKey: proofSubmitterKey,
                value: (proof.getWeb3Object() as Web3).utils.toWei("1", "gwei"),
            }
        )
        const result = await proof.sendSigned(signed.data as Web3Signature)
        console.log(result)
    }, 100000)
})
