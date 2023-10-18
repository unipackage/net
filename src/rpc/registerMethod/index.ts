import { RPCOptions, isRPCOptions } from "../interface"

function generateMethod(target: any, methods: string[]) {
    methods.forEach((method) => {
        Object.defineProperty(target.prototype, method, {
            value: async function (this: any, ...params: any[]) {
                let options: RPCOptions | null = null
                const lastParam = params[params.length - 1]
                if (typeof lastParam === "object" && isRPCOptions(lastParam)) {
                    options = params.pop()
                }
                return await this.request(
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

export function registerMethod(methods: string[]): ClassDecorator {
    return function (target: any) {
        generateMethod(target, methods)
    }
}
