import { EthersWallet } from "../../../src/evm/wallet/ethers"
import { Web3Wallet } from "../../../src/evm/wallet/web3"
export const etherWallet = new EthersWallet(process.env.PROVIDER_URL as string)
export const web3Wallet = new Web3Wallet(process.env.PROVIDER_URL as string)
