import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'
import { IpcError } from '../IpcError/IpcError.ts'

export const fixNodeWorkerParameters = (value: unknown) => {
  const transfer = GetTransferrables.getTransferrables(value)
  if (transfer.length === 0) {
    throw new IpcError('no transferrables found')
  }
  return {
    newValue: value,
    transfer: transfer,
  }
}
