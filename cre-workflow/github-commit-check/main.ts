import { CronCapability, handler, Runner, type Runtime } from "@chainlink/cre-sdk";

// Address 0xAf7443DD2C10816F56C7C165a973d44571687b03

export type Config = {
  schedule: string;
};

export const onCronTrigger = (runtime: Runtime<Config>): string => {
  runtime.log("Hello world! Workflow triggered.");
  return "Hello world!";
};

export const initWorkflow = (config: Config) => {
  const cron = new CronCapability();

  return [
    handler(
      cron.trigger(
        { schedule: config.schedule }
      ),
      onCronTrigger
    ),
  ];
};

export async function main() {
  const runner = await Runner.newRunner<Config>();
  await runner.run(initWorkflow);
}
