import DatasetProofAbi from "../testAbi/DatasetsProof.json"
import { Web3Evm } from "../../../src/evm/implements/web3"
import { withMethods } from "../../../src/shared/withMethods"
import { EvmOutput, isEvmTransactionOptions } from "../../../src/evm/interface"
import { providerUrl, proofContractAddress } from "./constant"

interface Proof {
    appendDatasetCollateral(...parmas: any[]): Promise<EvmOutput<any>>
}
@withMethods(["appendDatasetCollateral"], "send", isEvmTransactionOptions)
class Proof extends Web3Evm {}

export const proof = new Proof(
    DatasetProofAbi.abi,
    proofContractAddress,
    providerUrl
)
