import { EVMClient, HTTPClient } from "@chainlink/cre-sdk"
import { CommitOrBurn } from "../contracts/evm/ts/generated/CommitOrBurn"

export type Clients = {
    evmClient: EVMClient
    httpClient: HTTPClient
    contract: CommitOrBurn
}

export type Config = {
    schedule: string
    chainSelectorName: string
}

export type CommitResult = {
    githubId: string
    success: boolean
}