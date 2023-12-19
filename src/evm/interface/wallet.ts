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

export interface IWallet {
    add(
        account: Web3WalletAccount | EthersWalletAccount | string
    ): EvmOutput<void>

    clear(): EvmOutput<void>

    get(
        addressOrIndex: string | number
    ): EvmOutput<Web3WalletAccount | EthersWalletAccount>

    remove(addressOrIndex: string | number): EvmOutput<void>

    getDefault(): EvmOutput<Web3WalletAccount | EthersWalletAccount>

    setDefault(
        account: Web3WalletAccount | EthersWalletAccount | string
    ): EvmOutput<void>

    export(password?: string): Promise<EvmOutput<KeyStore[]>>

    import(keyName: KeyStore[], password?: string): Promise<EvmOutput<boolean>>
}
