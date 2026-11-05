import { CronCapability, handler, Runner, hexToBase64, bytesToHex, TxStatus, getNetwork, EVMClient, HTTPClient, consensusMedianAggregation, type Runtime } from "@chainlink/cre-sdk"
import { encodeAbiParameters, parseAbiParameters } from "viem"

import { CommitOrBurn } from "./contracts/evm/ts/generated/CommitOrBurn"
import fetchCommitsForUser from "./src/github"

export type Config = {
  schedule: string
  chainSelectorName: string
}

export type CommitResult = {
  githubId: string
  success: boolean
}

const onCronTrigger = (runtime: Runtime<Config>): string => {
  const commitResults: CommitResult[] = []

  const network = getNetwork({
    chainFamily: "evm",
    chainSelectorName: runtime.config.chainSelectorName,
  })
  if (!network) throw new Error("Network not found")
  const now = runtime.now();

  const client = new EVMClient(network.chainSelector.selector)
  const contractAddress = runtime.getSecret({ id: "CRE_CONTRACT_ADDRESS" }).result().value
  const contract = new CommitOrBurn(client, contractAddress as `0x${string}`)

  const currentRoundId = contract.sCurrentRound(runtime);
  const roundInfo = contract.getRoundInfo(runtime, currentRoundId);

  if (now.getTime() / 1000 <= Number(roundInfo.startTime)) {
    runtime.log(`Round ${currentRoundId} is not in registration period. Skipping.`);
    return "Skipped: not in registration period";
  }

  const githubIds = contract.getUsersGithubIdByRound(runtime, currentRoundId)

  const token = runtime.getSecret({ id: "GITHUB_TOKEN" }).result().value

  const httpClient = new HTTPClient();

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

  const writeResult = client
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

  return `Checked ${githubIds.length} users`
}

export const initWorkflow = (config: Config) => {
  const cron = new CronCapability()
  return [handler(cron.trigger({ schedule: config.schedule }), onCronTrigger)]
}

export async function main() {
  const runner = await Runner.newRunner<Config>()
  await runner.run(initWorkflow)
}