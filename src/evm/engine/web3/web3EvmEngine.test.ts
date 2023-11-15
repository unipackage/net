import { Web3, ContractAbi } from "web3"
import type { Contract } from "web3-eth-contract"
import Dataset from "./Datasets.json"
import DatasetProof from "./DatasetsProof.json"
import { Web3EVM } from "./web3EvmEngine"

describe("Web3 Contract Testing", () => {
    // const providerUrl = "http://192.168.1.168:1234/rpc/v1"
    // const provider = new Web3.providers.HttpProvider(providerUrl)
    const providerUrl = "https://api.calibration.node.glif.io/rpc/v1"
    let web3: Web3
    let contract: any
    let web3Evm: Web3EVM

    beforeAll(() => {
        web3 = new Web3(providerUrl)
    })

    it("metadata", async () => {
        web3Evm = new Web3EVM(
            Dataset.abi,
            "0xfE63eA58F3935809b574007a34d9298d61af8557",
            providerUrl
        )
        let meta = await web3Evm.call({
            method: "getDatasetMetadata",
            params: [1] as Number[],
        })
        console.log(meta)

        const metadataSubmitter = "0x15B2896f76Cee4E2C567e7bC671bB701D7339B30"
        const metadataSubmitterKey =
            "0x0904cdc9c54d32fd7bef4ac225dabfd5d7aeafeaa118ba5e2da8f8b4f36012a1"
        const submitDatasetMetadata =
            await web3Evm.signAndSendSignedTransaction(
                {
                    method: "submitDatasetMetadata",
                    params: [
                        "aaaa",
                        "aaaa",
                        "aaaa",
                        "aaaa",
                        "aaaa",
                        "aaaa",
                        512000000,
                        true,
                        1,
                    ],
                },
                {
                    web3Transaction: {
                        from: metadataSubmitter,
                    },
                },
                metadataSubmitterKey
            )
        console.log(submitDatasetMetadata)
    }, 300000)
    it("datasetsProof", async () => {
        web3Evm = new Web3EVM(
            DatasetProof.abi,
            "0x25bF0135646E4ae1A19977F4A47D4C3f72B37994",
            providerUrl
        )
        const proofSubmitter = "0x3D08114dD4F65B5DDCc760884249D9d1AE435Dee"
        const proofSubmitterKey =
            "0xe624c69077cfea8e36bf4f1a1383ad4555f2f52f2d34abfe54c0918b8d843099"

        const signature = await web3Evm.signAndSendSignedTransaction(
            { method: "appendDatasetCollateral", params: [1] },
            {
                web3Transaction: {
                    from: proofSubmitter,
                    value: web3.utils.toWei("1", "gwei"),
                },
            },
            proofSubmitterKey
        )
        console.log(signature)
    }, 300000)
})
