import { EVMClient, HTTPClient, getNetwork, type Runtime } from "@chainlink/cre-sdk"
import { CommitOrBurn } from "../contracts/evm/ts/generated/CommitOrBurn"
import { Config, Clients } from "./type"


export default function initClients(runtime: Runtime<Config>, contractAddress: string): Clients {
    const network = getNetwork({
        chainFamily: "evm",
        chainSelectorName: runtime.config.chainSelectorName,
        isTestnet: true,
    })
    if (!network) throw new Error("Network not found")

    const evmClient = new EVMClient(network.chainSelector.selector)
    const httpClient = new HTTPClient()
    const contract = new CommitOrBurn(
        evmClient,
        contractAddress as `0x${string}`
    )

    return { evmClient, httpClient, contract }
}