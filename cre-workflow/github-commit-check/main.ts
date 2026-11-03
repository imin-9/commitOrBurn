import { CronCapability, handler, Runner, getNetwork, EVMClient, HTTPClient, consensusMedianAggregation, median, type Runtime } from "@chainlink/cre-sdk"
import { CommitOrBurn } from "./contracts/evm/ts/generated/CommitOrBurn"
import fetchCommitsForUser from "./src/github"

export type Config = {
  schedule: string
  contractAddress: string
  chainSelectorName: string
}

const onCronTrigger = (runtime: Runtime<Config>): string => {
  const network = getNetwork({
    chainFamily: "evm",
    chainSelectorName: runtime.config.chainSelectorName,
  })
  if (!network) throw new Error("Network not found")
  const now = runtime.now();

  const client = new EVMClient(network.chainSelector.selector)
  const contract = new CommitOrBurn(client, runtime.config.contractAddress as `0x${string}`)

  const currentRoundId = contract.sCurrentRound(runtime);
  const roundInfo = contract.getRoundInfo(runtime, currentRoundId);

  runtime.log(`${now.getTime() / 1000 >= Number(roundInfo.startTime)}`);

  if (now.getTime() / 1000 <= Number(roundInfo.startTime)) {
    runtime.log(`Round ${currentRoundId} is not in registration period. Skipping.`);
    return "Skipped: not in registration period";
  }

  const githubIds = contract.getUsersByRound(runtime, currentRoundId)

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
    runtime.log(`${githubId}, ${JSON.stringify(commits)}`);
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