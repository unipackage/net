import DatasetProofAbi from "../testAbi/DatasetsProof.json"
import { Web3Evm } from "../../../src/evm/implements/web3"
import { EthersEvm } from "../../../src/evm/implements/ether"
import { withMethods } from "../../../src/shared/withMethods"
import { EvmOutput, isEvmTransactionOptions } from "../../../src/evm/interface"
import { providerUrl, proofContractAddress } from "./constant"

interface Web3Proof {
    appendDatasetCollateral(...parmas: any[]): Promise<EvmOutput<any>>
}
//@ts-ignore
@withMethods(["appendDatasetCollateral"], "send", isEvmTransactionOptions)
class Web3Proof extends Web3Evm {}

export const web3Proof = new Web3Proof(
    DatasetProofAbi.abi,
    proofContractAddress,
    providerUrl
)

interface EthersProof {
    appendDatasetCollateral(...parmas: any[]): Promise<EvmOutput<any>>
}
//@ts-ignore
@withMethods(["appendDatasetCollateral"], "send", isEvmTransactionOptions)
class EthersProof extends EthersEvm {}

export const ethersProof = new EthersProof(
    DatasetProofAbi.abi,
    proofContractAddress,
    providerUrl
)
