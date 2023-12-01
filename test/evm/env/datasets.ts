import DatasetsAbi from "../testAbi/Datasets.json"
import { Web3Evm } from "../../../src/evm/implements/web3"
import { withMethods } from "../../../src/shared/withMethods"
import { EvmOutput, isEvmTransactionOptions } from "../../../src/evm/interface"
import { datasetContractAddress, providerUrl } from "./constant"

interface Datasets {
    getDatasetMetadata(id: number): Promise<EvmOutput<any>>
    submitDatasetMetadata(...parmas: any[]): Promise<EvmOutput<any>>
}
@withMethods(["getDatasetMetadata"], "call")
@withMethods(["submitDatasetMetadata"], "send", isEvmTransactionOptions)
class Datasets extends Web3Evm {}

export const datasets = new Datasets(
    DatasetsAbi.abi,
    datasetContractAddress,
    providerUrl
)
