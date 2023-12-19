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

export class Web3Wallet implements IWallet {
    private web3: Web3
    private default?: Web3WalletAccount
    private wallet: Wallet

    constructor(providerUrl: string) {
        this.web3 = new Web3(providerUrl)
        this.wallet = this.web3.eth.accounts.wallet
    }

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

    get(addressOrIndex: string | number): EvmOutput<Web3WalletAccount> {
        try {
            const account = this.wallet.get(addressOrIndex)
            return { ok: true, data: account as Web3WalletAccount }
        } catch (error) {
            return {
                ok: false,
                error: `get account error:${error}`,
            }
        }
    }

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

    export(password?: string): Promise<EvmOutput<Web3KeyStore[]>> {
        throw new Error("not implement")
    }

    import(
        keyName: Web3KeyStore[],
        password?: string
    ): Promise<EvmOutput<boolean>> {
        throw new Error("not implement")
    }
}
