import nock from "nock"
import { IEVM } from "../../../src"

export interface EvmMockHookInput {
    evm: IEVM
    method: string
    errorCode?: number
    reply?: string
    jsonrpcVersion?: string
    id?: string
}

export const defaultEvmMockHookInput: EvmMockHookInput = {
    evm: {} as IEVM,
    method: "",
    reply: "",
    errorCode: 200,
    jsonrpcVersion: "2.0",
    id: "d9038463-6ec7-45d2-a0cb-c3dda7958196",
}

export function mochaAddEvmHook(evmMockHookInput: EvmMockHookInput) {
    const mergeInput = { ...defaultEvmMockHookInput, evmMockHookInput }
    const url = mergeInput.evm.getProviderUrl()
    if (!url) {
        return
    }

    const urlObject = new URL(url)
    const functionSignature =
        mergeInput.evm.encodeFunctionSignatureByFuntionName(mergeInput.method)

    nock(urlObject.hostname)
        .post(urlObject.pathname, new RegExp("(?=" + functionSignature + ")"))
        .reply(mergeInput.errorCode, {
            jsonrpc: mergeInput.jsonrpcVersion,
            result: mergeInput.reply,
            id: mergeInput.id,
        })
    console.log(`==== Add method [${mergeInput.method}] hook success!====`)
}
