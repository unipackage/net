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

import { EvmOutput } from "./"
import {
    Web3BaseWalletAccount,
    KeyStore as Web3OriginKeystore,
} from "web3-types"
import { Wallet as EthersOriginWallet } from "ethers"

export interface Web3WalletAccount extends Web3BaseWalletAccount {}
export class EthersWalletAccount extends EthersOriginWallet {}

export type Web3KeyStore = Web3OriginKeystore
export type EthersKeyStore = string
export type KeyStore = Web3KeyStore | EthersKeyStore

/**
 * Interface for defining the functionality of a general wallet.
 */
export interface IWallet {
    /**
     * Add an account to the wallet.
     *
     * @param account - The account to be added.
     * @returns An output representing the operation's result.
     */
    add(
        account: Web3WalletAccount | EthersWalletAccount | string
    ): EvmOutput<void>

    /**
     * Clear all accounts from the wallet.
     *
     * @returns An output representing the operation's result.
     */
    clear(): EvmOutput<void>

    /**
     * Retrieve an account from the wallet using its address or index.
     *
     * @param addressOrIndex - The address or index of the account to retrieve.
     * @returns An output representing the operation's result.
     */
    get(
        addressOrIndex: string | number
    ): EvmOutput<Web3WalletAccount | EthersWalletAccount>

    /**
     * Remove an account from the wallet using its address or index.
     *
     * @param addressOrIndex - The address or index of the account to remove.
     * @returns An output representing the operation's result.
     */
    remove(addressOrIndex: string | number): EvmOutput<void>

    /**
     * Retrieve the default account from the wallet.
     *
     * @returns An output representing the operation's result.
     */
    getDefault(): EvmOutput<Web3WalletAccount | EthersWalletAccount>

    /**
     * Set a new default account for the wallet.
     *
     * @param account - The account to set as default.
     * @returns An output representing the operation's result.
     */
    setDefault(
        account: Web3WalletAccount | EthersWalletAccount | string
    ): EvmOutput<void>

    /**
     * Export the accounts in the wallet as encrypted keystore files.
     *
     * @param password - The password to encrypt the keystore files.
     * @returns A promise resolving to an output representing the operation's result.
     */
    export(password?: string): Promise<EvmOutput<KeyStore[]>>

    /**
     * Import and add accounts to the wallet from encrypted keystore files.
     *
     * @param keyName - The keystore data to import.
     * @param password - The password to decrypt the keystore files.
     * @returns A promise resolving to an output representing the operation's result.
     */
    import(keyName: KeyStore[], password?: string): Promise<EvmOutput<boolean>>
}
