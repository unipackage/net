import DatasetsAbi from "../testAbi/Datasets.json"
import { Web3Evm } from "../../../src/evm/implements/web3"
import { EthersEvm } from "../../../src/evm/implements/ether"
import { withMethods } from "../../../src/shared/withMethods"
import { EvmOutput, isEvmTransactionOptions } from "../../../src/evm/interface"
import { datasetContractAddress, providerUrl } from "./constant"

interface Web3Datasets {
    getDatasetMetadata(id: number): Promise<EvmOutput<any>>
    getDatasetMetadataSubmitter(id: number): Promise<EvmOutput<string>>
    submitDatasetMetadata(...parmas: any[]): Promise<EvmOutput<any>>
}
//@ts-ignore
@withMethods(["getDatasetMetadata", "getDatasetMetadataSubmitter"], "call")
//@ts-ignore
@withMethods(["submitDatasetMetadata"], "send", isEvmTransactionOptions)
class Web3Datasets extends Web3Evm {}

export const web3Datasets = new Web3Datasets(
    DatasetsAbi.abi,
    datasetContractAddress,
    providerUrl
)

interface EthersDatasets {
    getDatasetMetadata(id: number): Promise<EvmOutput<any>>
    getDatasetMetadataSubmitter(id: number): Promise<EvmOutput<string>>
    submitDatasetMetadata(...parmas: any[]): Promise<EvmOutput<any>>
}
//@ts-ignore
@withMethods(["getDatasetMetadata", "getDatasetMetadataSubmitter"], "call")
//@ts-ignore
@withMethods(["submitDatasetMetadata"], "send", isEvmTransactionOptions)
class EthersDatasets extends EthersEvm {}

export const ethersDatasets = new EthersDatasets(
    DatasetsAbi.abi,
    datasetContractAddress,
    providerUrl
)
