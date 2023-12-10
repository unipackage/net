/*******************************************************************************
 *   (c) 2023 unipackage
 *
 *  Licensed under the GNU General Public License, Version 3.0 or later (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/

import { isEvmTransactionOptions } from "../interface"
import { withMethods } from "../../shared/withMethods"

/**
 * withSendMethod:Decorator function to dynamically add methods to a class prototype.
 *
 * @param methods - An array of method names to be added.
 * @returns A ClassDecorator function.
 */
export function withSendMethod(methods: string[]): ClassDecorator {
    return withMethods(methods, "send", isEvmTransactionOptions)
}

/**
 * withCallMethod:Decorator function to dynamically add methods to a class prototype.
 *
 * @param methods - An array of method names to be added.
 * @returns A ClassDecorator function.
 */
export function withCallMethod(methods: string[]): ClassDecorator {
    return withMethods(methods, "call")
}
