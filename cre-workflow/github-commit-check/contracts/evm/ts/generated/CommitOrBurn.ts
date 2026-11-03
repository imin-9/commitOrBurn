// Code generated — DO NOT EDIT.
import {
  decodeEventLog,
  decodeFunctionResult,
  encodeEventTopics,
  encodeFunctionData,
  zeroAddress,
} from 'viem'
import type { Address, Hex } from 'viem'
import {
  bytesToHex,
  encodeCallMsg,
  EVMClient,
  hexToBase64,
  LAST_FINALIZED_BLOCK_NUMBER,
  prepareReportRequest,
  type EVMLog,
  type Runtime,
} from '@chainlink/cre-sdk'

export interface DecodedLog<T> extends Omit<EVMLog, 'data'> { data: T }

const encodeTopicValue = (t: Hex | Hex[] | null): string[] => {
  if (t == null) return []
  if (Array.isArray(t)) return t.map(hexToBase64)
  return [hexToBase64(t)]
}





/**
 * Filter params for Deposited. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type DepositedTopics = {
  user?: `0x${string}`
  roundId?: bigint
  githubId?: string
}

/**
 * Decoded Deposited event data.
 */
export type DepositedDecoded = {
  user: `0x${string}`
  roundId: bigint
  githubId: string
  shares: bigint
}


export const CommitOrBurnABI = [{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"UNIT","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"deposit","inputs":[{"name":"_githubId","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"getRoundInfo","inputs":[{"name":"_roundId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple","internalType":"structCommitOrBurn.Round","components":[{"name":"startTime","type":"uint256","internalType":"uint256"},{"name":"endTime","type":"uint256","internalType":"uint256"},{"name":"totalDeposited","type":"uint256","internalType":"uint256"},{"name":"totalShares","type":"uint256","internalType":"uint256"},{"name":"resolved","type":"bool","internalType":"bool"}]}],"stateMutability":"view"},{"type":"function","name":"getUserInfo","inputs":[{"name":"_user","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"tuple","internalType":"structCommitOrBurn.User","components":[{"name":"githubId","type":"string","internalType":"string"},{"name":"roundId","type":"uint256","internalType":"uint256"},{"name":"shares","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"getUsersByRound","inputs":[{"name":"_roundId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string[]","internalType":"string[]"}],"stateMutability":"view"},{"type":"function","name":"s_currentRound","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"event","name":"Deposited","inputs":[{"name":"user","type":"address","indexed":true,"internalType":"address"},{"name":"roundId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"githubId","type":"string","indexed":true,"internalType":"string"},{"name":"shares","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"CommitOrBurn__CantEnterSameRound","inputs":[]},{"type":"error","name":"CommitOrBurn__GithubIdIsNotExist","inputs":[]},{"type":"error","name":"CommitOrBurn__MustSendMoreThanOne","inputs":[]},{"type":"error","name":"CommitOrBurn__MustSendMultipleOfUNIT","inputs":[]}] as const

export class CommitOrBurn {
  constructor(
    private readonly client: EVMClient,
    public readonly address: Address,
  ) {}

  uNIT(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: CommitOrBurnABI,
      functionName: 'UNIT' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: CommitOrBurnABI,
      functionName: 'UNIT' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  getRoundInfo(
    runtime: Runtime<unknown>,
    roundId: bigint,
  ): { startTime: bigint; endTime: bigint; totalDeposited: bigint; totalShares: bigint; resolved: boolean } {
    const callData = encodeFunctionData({
      abi: CommitOrBurnABI,
      functionName: 'getRoundInfo' as const,
      args: [roundId],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: CommitOrBurnABI,
      functionName: 'getRoundInfo' as const,
      data: bytesToHex(result.data),
    }) as { startTime: bigint; endTime: bigint; totalDeposited: bigint; totalShares: bigint; resolved: boolean }
  }

  getUserInfo(
    runtime: Runtime<unknown>,
    user: `0x${string}`,
  ): { githubId: string; roundId: bigint; shares: bigint } {
    const callData = encodeFunctionData({
      abi: CommitOrBurnABI,
      functionName: 'getUserInfo' as const,
      args: [user],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: CommitOrBurnABI,
      functionName: 'getUserInfo' as const,
      data: bytesToHex(result.data),
    }) as { githubId: string; roundId: bigint; shares: bigint }
  }

  getUsersByRound(
    runtime: Runtime<unknown>,
    roundId: bigint,
  ): readonly string[] {
    const callData = encodeFunctionData({
      abi: CommitOrBurnABI,
      functionName: 'getUsersByRound' as const,
      args: [roundId],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: CommitOrBurnABI,
      functionName: 'getUsersByRound' as const,
      data: bytesToHex(result.data),
    }) as readonly string[]
  }

  sCurrentRound(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: CommitOrBurnABI,
      functionName: 's_currentRound' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: CommitOrBurnABI,
      functionName: 's_currentRound' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  writeReportFromDeposit(
    runtime: Runtime<unknown>,
    githubId: string,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: CommitOrBurnABI,
      functionName: 'deposit' as const,
      args: [githubId],
    })

    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  writeReport(
    runtime: Runtime<unknown>,
    callData: Hex,
    gasConfig?: { gasLimit?: string },
  ) {
    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  /**
   * Creates a log trigger for Deposited events.
   * The returned trigger's adapt method decodes the raw log into DepositedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerDeposited(
    filters?: DepositedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: CommitOrBurnABI,
        eventName: 'Deposited' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        user: f.user,
        roundId: f.roundId,
        githubId: f.githubId,
      }
      const encoded = encodeEventTopics({
        abi: CommitOrBurnABI,
        eventName: 'Deposited' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          user: f.user,
          roundId: f.roundId,
          githubId: f.githubId,
        }
        return encodeEventTopics({
          abi: CommitOrBurnABI,
          eventName: 'Deposited' as const,
          args,
        })
      })
      topics = allEncoded[0].map((_, i) => ({
        values: [...new Set(allEncoded.flatMap((row) => encodeTopicValue(row[i])))],
      }))
    }
    const baseTrigger = this.client.logTrigger({
      addresses: [hexToBase64(this.address)],
      topics,
    })
    const contract = this
    return {
      capabilityId: () => baseTrigger.capabilityId(),
      method: () => baseTrigger.method(),
      outputSchema: () => baseTrigger.outputSchema(),
      configAsAny: () => baseTrigger.configAsAny(),
      adapt: (rawOutput: EVMLog): DecodedLog<DepositedDecoded> => contract.decodeDeposited(rawOutput),
    }
  }

  /**
   * Decodes a log into Deposited data, preserving all log metadata.
   */
  decodeDeposited(log: EVMLog): DecodedLog<DepositedDecoded> {
    const decoded = decodeEventLog({
      abi: CommitOrBurnABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as DepositedDecoded }
  }
}

