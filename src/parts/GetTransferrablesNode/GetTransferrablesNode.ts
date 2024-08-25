import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'

export const getTransferrablesNode = (value: unknown): any => {
  const transferrables = GetTransferrables.getTransferrables(value)
  if (transferrables.length === 0) {
    return undefined
  }
  return transferrables[0]
}
