import * as IsTransferrable from '../IsTransferrable/IsTransferrable.ts'

export const walkValue = (value: unknown, transferrables: unknown[]) => {
  if (!value) {
    return value
  }
  if (IsTransferrable.isTransferrable(value)) {
    transferrables.push(value)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      walkValue(item, transferrables)
    }
    return
  }
  if (typeof value === 'object') {
    const newObject = Object.create(null)
    for (const property of Object.values(value)) {
      walkValue(property, transferrables)
    }
    return newObject
  }
  return value
}
