import { IRPC, RPCOptions, RPCRequest, RPCResponse } from "./interface"
import { RPCEngine } from "./engine"

export class RPC implements IRPC {
    private engine: RPCEngine
    constructor(engine: RPCEngine) {
        this.engine = engine
    }

    public async request(
        request: RPCRequest,
        options?: RPCOptions | undefined
    ): Promise<RPCResponse<any>> {
        return await this.engine.request(request, options)
    }
}
