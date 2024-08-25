import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'
import * as RemoveValues from '../RemoveValues/RemoveValues.ts'

// workaround for node not supporting transferrable objects
// as parameters. If the transferrable object is a parameter,
// it is received as a plain object is received in the receiving process
export const fixNodeParameters = (value: unknown) => {
  const transfer = GetTransferrables.getTransferrables(value)
  if (transfer.length === 0) {
    throw new Error('no transferrables found')
  }
  const newValue = RemoveValues.removeValues(value, transfer)
  return {
    newValue,
    transfer: transfer[0],
  }
}
