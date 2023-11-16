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

export function withMethods(
    methods: string[],
    baseMethod: string,
    isOptions?: (parama: any) => boolean
): ClassDecorator {
    return function (target: any) {
        addMethod(target, methods, baseMethod, isOptions)
    }
}
