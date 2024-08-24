import * as WalkValue from '../WalkValue/WalkValue.ts'

export const getTransferrables = (value: unknown): Transferable[] => {
  const transferrables: Transferable[] = []
  WalkValue.walkValue(value, transferrables)
  return transferrables
}
