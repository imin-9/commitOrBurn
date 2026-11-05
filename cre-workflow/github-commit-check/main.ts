import { CronCapability, handler, Runner, type Runtime } from "@chainlink/cre-sdk"

import initClients from "./src/client"
import runDailyCommitsChek from "./src/dailyCheck"
import { Config } from "./src/type"


const onCronTrigger = (runtime: Runtime<Config>): boolean => {
  const contractAddress = runtime.getSecret({ id: "CRE_CONTRACT_ADDRESS" }).result().value
  const token = runtime.getSecret({ id: "GITHUB_TOKEN" }).result().value

  const clients = initClients(runtime, contractAddress);
  return runDailyCommitsChek(runtime, clients, contractAddress, token);
}

export const initWorkflow = (config: Config) => {
  const cron = new CronCapability()
  return [handler(cron.trigger({ schedule: config.schedule }), onCronTrigger)]
}

export async function main() {
  const runner = await Runner.newRunner<Config>()
  await runner.run(initWorkflow)
}