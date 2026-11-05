// Code generated — DO NOT EDIT.
import type { Address } from 'viem'
import { addContractMock, type ContractMock, type EvmMock } from '@chainlink/cre-sdk/test'

import { CommitOrBurnABI } from './CommitOrBurn'

export type CommitOrBurnMock = {
  uNIT?: () => bigint
  getExpectedAuthor?: () => `0x${string}`
  getExpectedWorkflowId?: () => `0x${string}`
  getExpectedWorkflowName?: () => `0x${string}`
  getForwarderAddress?: () => `0x${string}`
  getRoundInfo?: (roundId: bigint) => { startTime: bigint; endTime: bigint; totalDeposited: bigint; totalShares: bigint; resolved: boolean }
  getUserInfo?: (user: `0x${string}`) => { githubId: string; roundId: bigint; shares: bigint; success: boolean }
  getUsersGithubIdByRound?: (roundId: bigint) => readonly string[]
  owner?: () => `0x${string}`
  sCurrentRound?: () => bigint
  supportsInterface?: (interfaceId: `0x${string}`) => boolean
} & Pick<ContractMock<typeof CommitOrBurnABI>, 'writeReport'>

export function newCommitOrBurnMock(address: Address, evmMock: EvmMock): CommitOrBurnMock {
  return addContractMock(evmMock, { address, abi: CommitOrBurnABI }) as CommitOrBurnMock
}

