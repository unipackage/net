import { EvmExecuteOptions, isEvmExecuteOptions } from "../interface"

function generateEvmExecuteMethod(target: any, methods: string[]) {
    methods.forEach((method) => {
        Object.defineProperty(target.prototype, method, {
            value: async function (this: any, ...params: any[]) {
                let options: EvmExecuteOptions | null = null
                const lastParam = params[params.length - 1]
                if (
                    typeof lastParam === "object" &&
                    isEvmExecuteOptions(lastParam)
                ) {
                    options = params.pop()
                }
                return await this.execute(
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

export function registerEvmExecuteMethod(methods: string[]): ClassDecorator {
    return function (target: any) {
        generateEvmExecuteMethod(target, methods)
    }
}
