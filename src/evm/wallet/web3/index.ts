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

import {
    IWallet,
    Web3WalletAccount,
    Web3KeyStore,
} from "../../interface/wallet"
import { Web3 } from "web3"
import { Wallet } from "web3-eth-accounts"
import { EvmOutput } from "../../interface"

/**
 * Implementation of the IWallet interface using the web3.js library.
 */
export class Web3Wallet implements IWallet {
    private web3: Web3
    private default?: Web3WalletAccount
    private wallet: Wallet

    /**
     * Constructor to initialize the Web3Wallet with a given provider URL.
     *
     * @param providerUrl - The URL of the provider to connect to.
     */
    constructor(providerUrl: string) {
        this.web3 = new Web3(providerUrl)
        this.wallet = this.web3.eth.accounts.wallet
    }

    /**
     * Add an account to the wallet.
     *
     * @param account - The account object or private key to add.
     * @returns An output representing the operation's result.
     */
    add(account: Web3WalletAccount | string): EvmOutput<void> {
        try {
            this.wallet.add(account)
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: `add account error:${error}`,
            }
        }
    }

    /**
     * Clear all accounts from the wallet.
     *
     * @returns An output representing the operation's result.
     */
    clear(): EvmOutput<void> {
        try {
            this.wallet.clear()
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: `clear account error:${error}`,
            }
        }
    }

    /**
     * Retrieve an account from the wallet using its address or index.
     *
     * @param addressOrIndex - The address or index of the account to retrieve.
     * @returns An output representing the operation's result.
     */
    get(addressOrIndex: string | number): EvmOutput<Web3WalletAccount> {
        try {
            const account = this.wallet.find((wallet, index) => {
                return (
                    wallet.address === addressOrIndex ||
                    addressOrIndex === index
                )
            })
            return { ok: true, data: account as Web3WalletAccount }
        } catch (error) {
            return {
                ok: false,
                error: `get account error:${error}`,
            }
        }
    }

    /**
     * Remove an account from the wallet using its address or index.
     *
     * @param addressOrIndex - The address or index of the account to remove.
     * @returns An output representing the operation's result.
     */
    remove(addressOrIndex: string | number): EvmOutput<void> {
        try {
            this.wallet.remove(addressOrIndex)
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: `get account error:${error}`,
            }
        }
    }

    /**
     * Retrieve the default account from the wallet.
     *
     * @returns An output representing the operation's result.
     */
    getDefault(): EvmOutput<Web3WalletAccount> {
        if (this.wallet.length === 0) {
            return {
                ok: false,
                error: "getDefault error: no account exist in wallet",
            }
        }
        if (!this.default) {
            this.setDefault(this.get(0).data as Web3WalletAccount)
        }

        return {
            ok: true,
            data: this.default,
        }
    }

    /**
     * Set a new default account for the wallet.
     *
     * @param account - The account or its address to set as default.
     * @returns An output representing the operation's result.
     */
    setDefault(account: Web3WalletAccount | string): EvmOutput<void> {
        let address: string
        if (typeof account === "string") {
            address = account
        } else {
            address = account.address
        }

        const getResult = this.get(address)
        if (!getResult.ok || !getResult.data) {
            return {
                ok: false,
                error: `setDefault error:${getResult.error}`,
            }
        }

        this.default = getResult.data
        return {
            ok: true,
        }
    }

    /**
     * Export the accounts in the wallet as encrypted keystore files.
     * Not yet implemented.
     *
     * @param password - The password to encrypt the keystore files.
     * @returns A promise resolving to an output representing the operation's result.
     */
    export(password?: string): Promise<EvmOutput<Web3KeyStore[]>> {
        throw new Error("not implement")
    }

    /**
     * Import and add accounts to the wallet from encrypted keystore files.
     * Not yet implemented.
     *
     * @param keyName - The keystore data to import.
     * @param password - The password to decrypt the keystore files.
     * @returns A promise resolving to an output representing the operation's result.
     */
    import(
        keyName: Web3KeyStore[],
        password?: string
    ): Promise<EvmOutput<boolean>> {
        throw new Error("not implement")
    }
}
