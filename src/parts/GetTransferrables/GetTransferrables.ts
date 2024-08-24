import * as WalkValue from '../WalkValue/WalkValue.ts'

export const getTransferrables = (value: unknown): readonly unknown[] => {
  const transferrables: unknown[] = []
  WalkValue.walkValue(value, transferrables)
  return transferrables
}
