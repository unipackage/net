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

import { IWallet, EthersKeyStore } from "../../interface/wallet"
import { ethers, Wallet } from "ethers"
import { EvmOutput } from "../../interface"

/**
 * Implementation of the IWallet interface using ethers.js library.
 */
export class EthersWallet implements IWallet {
    private provider: ethers.JsonRpcProvider
    private wallets: Wallet[] = []
    private default?: Wallet

    /**
     * Constructor to initialize the EthersWallet with a given provider URL.
     *
     * @param providerUrl - The URL of the provider to connect to.
     */
    constructor(providerUrl: string) {
        this.provider = new ethers.JsonRpcProvider(providerUrl)
    }

    /**
     * Add an account to the wallet.
     *
     * @param account - The account private key or address to add.
     * @returns An output representing the operation's result.
     */
    add(account: string): EvmOutput<void> {
        try {
            const add = new Wallet(account, this.provider)
            this.wallets.push(add)
            return {
                ok: true,
            }
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
        this.wallets = []
        return { ok: true }
    }

    /**
     * Retrieve an account from the wallet using its address or index.
     *
     * @param addressOrIndex - The address or index of the account to retrieve.
     * @returns An output representing the operation's result.
     */
    get(addressOrIndex: string | number): EvmOutput<Wallet> {
        try {
            const result = this.wallets.find((wallet, index) => {
                return (
                    wallet.address === addressOrIndex ||
                    addressOrIndex === index
                )
            }) as Wallet
            return {
                ok: true,
                data: result,
            }
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
        const getRes = this.get(addressOrIndex)
        if (!getRes.ok || !getRes.data) {
            return {
                ok: false,
                error: `remove account error: account not exist`,
            }
        }

        const index = this.wallets.indexOf(getRes.data)
        if (index === -1) {
            return {
                ok: false,
                error: `remove account error: account not exist`,
            }
        }
        this.wallets.splice(index, 1)
        return {
            ok: true,
        }
    }

    /**
     * Retrieve the default account from the wallet.
     *
     * @returns An output representing the operation's result.
     */
    getDefault(): EvmOutput<Wallet> {
        if (this.wallets.length === 0) {
            return {
                ok: false,
                error: "getDefault error: no account exist in wallet",
            }
        }
        if (!this.default) {
            this.setDefault(this.get(0)?.data as Wallet)
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
    setDefault(account: Wallet | string): EvmOutput<void> {
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
    export(password?: string): Promise<EvmOutput<EthersKeyStore[]>> {
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
        keyName: EthersKeyStore[],
        password?: string
    ): Promise<EvmOutput<boolean>> {
        throw new Error("not implement")
    }
}
