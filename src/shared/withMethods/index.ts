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

/**
 * Dynamically adds methods to a class prototype based on specified criteria.
 *
 * @param target - The target class constructor.
 * @param methods - An array of method names to be added.
 * @param baseMethod - The base method to invoke when the added methods are called.
 * @param isOptions - An optional function to check if the last parameter is an options object.
 */
function addMethod(
    target: any,
    methods: string[],
    baseMethod: string,
    isOptions?: (parama: any) => boolean
) {
    methods.forEach((method) => {
        Object.defineProperty(target.prototype, method, {
            value: async function (this: any, ...params: any[]) {
                let options: any
                const lastParam = params[params.length - 1]
                if (
                    isOptions &&
                    typeof lastParam === "object" &&
                    isOptions(lastParam)
                ) {
                    options = params.pop()
                }
                return await this[baseMethod](
                    {
                        method,
                        params,
                    },
                    options
                )
            },
        })
    })
}

/**
 * Decorator function to dynamically add methods to a class prototype.
 *
 * @param methods - An array of method names to be added.
 * @param baseMethod - The base method to invoke when the added methods are called.
 * @param isOptions - An optional function to check if the last parameter is an options object.
 * @returns A ClassDecorator function.
 */
export function withMethods(
    methods: string[],
    baseMethod: string,
    isOptions?: (parama: any) => boolean
): ClassDecorator {
    return function (target: any) {
        addMethod(target, methods, baseMethod, isOptions)
    }
}
