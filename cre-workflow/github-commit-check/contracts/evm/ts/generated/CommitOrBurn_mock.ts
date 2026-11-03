// Code generated — DO NOT EDIT.
import type { Address } from 'viem'
import { addContractMock, type ContractMock, type EvmMock } from '@chainlink/cre-sdk/test'

import { CommitOrBurnABI } from './CommitOrBurn'

export type CommitOrBurnMock = {
  uNIT?: () => bigint
  getRoundInfo?: (roundId: bigint) => { startTime: bigint; endTime: bigint; totalDeposited: bigint; totalShares: bigint; resolved: boolean }
  getUserInfo?: (user: `0x${string}`) => { githubId: string; roundId: bigint; shares: bigint }
  getUsersByRound?: (roundId: bigint) => readonly string[]
  sCurrentRound?: () => bigint
} & Pick<ContractMock<typeof CommitOrBurnABI>, 'writeReport'>

export function newCommitOrBurnMock(address: Address, evmMock: EvmMock): CommitOrBurnMock {
  return addContractMock(evmMock, { address, abi: CommitOrBurnABI }) as CommitOrBurnMock
}

