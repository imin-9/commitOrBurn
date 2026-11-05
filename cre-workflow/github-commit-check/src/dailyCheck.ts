import { consensusMedianAggregation, EVMClient, HTTPClient, hexToBase64, bytesToHex, TxStatus, type Runtime } from "@chainlink/cre-sdk"
import { encodeAbiParameters, parseAbiParameters } from "viem"

import { CommitOrBurn } from "../contracts/evm/ts/generated/CommitOrBurn"
import fetchCommitsForUser from "./github";
import { Clients, CommitResult, Config } from "./type"

export default function runDailyCommitsChek(runtime: Runtime<Config>, client: Clients, contractAddress: string, token: string): boolean {
    const evmClient = client.evmClient;
    const httpClient = client.httpClient;
    const contract = client.contract;

    const now = runtime.now();

    const currentRoundId = contract.sCurrentRound(runtime);

    if (!isRoundActive(runtime, contract, currentRoundId, now)) {
        return false;
    }

    const githubIds = contract.getUsersGithubIdByRound(runtime, currentRoundId);

    const commitResults = getCommitsResults(runtime, httpClient, githubIds, token, now);

    return sendReport(runtime, evmClient, contractAddress, commitResults);
}

function isRoundActive(runtime: Runtime<Config>, contract: CommitOrBurn, currentRoundId: bigint, now: Date): boolean {
    const roundInfo = contract.getRoundInfo(runtime, currentRoundId);

    if (now.getTime() / 1000 <= Number(roundInfo.startTime)) {
        runtime.log(`Round ${currentRoundId} is not in registration period. Skipping.`);
        return false;
    }

    return true;
}

function getCommitsResults(runtime: Runtime<Config>, httpClient: HTTPClient, githubIds: readonly string[], token: string, now: Date): CommitResult[] {
    const commitResults: CommitResult[] = []

    for (const githubId of githubIds) {
        const commits = httpClient
            .sendRequest(
                runtime,
                fetchCommitsForUser,
                consensusMedianAggregation<number>()
            )(githubId, token, now)
            .result()

        let success = false;

        if (commits !== 0) {
            success = true;
        }

        const reulst = {
            githubId: githubId,
            success: success
        }

        commitResults.push(reulst)

        runtime.log(`${reulst.githubId}, ${reulst.success}`);
    }

    return commitResults;
}

function sendReport(runtime: Runtime<Config>, evmClient: EVMClient, contractAddress: string, commitResults: CommitResult[]): boolean {
    const reportData = encodeAbiParameters(
        parseAbiParameters("(string githubId, bool success)[] results"),
        [commitResults]
    )

    const reportResponse = runtime
        .report({
            encodedPayload: hexToBase64(reportData),
            encoderName: "evm",
            signingAlgo: "ecdsa",
            hashingAlgo: "keccak256",
        })
        .result()

    const writeResult = evmClient
        .writeReport(runtime, {
            receiver: contractAddress as `0x${string}`,
            report: reportResponse,
            gasConfig: {
                gasLimit: "500000",
            },
        })
        .result()

    if (writeResult.txStatus === TxStatus.SUCCESS) {
        const txHash = bytesToHex(writeResult.txHash || new Uint8Array(32))
        runtime.log(`Transaction successful: ${txHash}`)
    } else {
        throw new Error(`Transaction failed: ${writeResult.txStatus}`)
    }

    return true
}