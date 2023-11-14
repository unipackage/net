function addMethod<T extends Object>(
    target: any,
    methods: string[],
    baseMethod: string,
    options?: T
) {
    methods.forEach((method) => {
        Object.defineProperty(target.prototype, method, {
            value: async function (this: any, ...params: any[]) {
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

export function withMethods<T extends Object>(
    methods: string[],
    baseMethod: string,
    options?: T
): ClassDecorator {
    return function (target: any) {
        addMethod<T>(target, methods, baseMethod, options)
    }
}
