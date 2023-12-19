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

export class EthersWallet implements IWallet {
    private provider: ethers.JsonRpcProvider
    private wallets: Wallet[] = []
    private default?: Wallet

    constructor(providerUrl: string) {
        this.provider = new ethers.JsonRpcProvider(providerUrl)
    }

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

    clear(): EvmOutput<void> {
        this.wallets = []
        return { ok: true }
    }

    get(addressOrIndex: string | number): EvmOutput<Wallet> {
        let result: Wallet
        try {
            if (typeof addressOrIndex === "number") {
                result = this.wallets[addressOrIndex]
            } else {
                result = this.wallets.find((wallet) => {
                    return wallet.address === addressOrIndex
                }) as Wallet
            }
            return {
                ok: true,
                data: result as Wallet,
            }
        } catch (error) {
            return {
                ok: false,
                error: `get account error:${error}`,
            }
        }
    }

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

    getDefault(): EvmOutput<Wallet> {
        if (this.wallets.length === 0) {
            return {
                ok: false,
                error: "getDefault error: no account exist in wallet",
            }
        }
        if (!this.default) {
            this.setDefault(this.get(0).data as Wallet)
        }

        return {
            ok: true,
            data: this.default,
        }
    }

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

    export(password?: string): Promise<EvmOutput<EthersKeyStore[]>> {
        throw new Error("not implement")
    }

    import(
        keyName: EthersKeyStore[],
        password?: string
    ): Promise<EvmOutput<boolean>> {
        throw new Error("not implement")
    }
}
