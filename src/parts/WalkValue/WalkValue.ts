import * as IsTransferrable from '../IsTransferrable/IsTransferrable.ts'

export const walkValue = (value: unknown, transferrables: unknown[]) => {
  if (!value) {
    return value
  }
  if (IsTransferrable.isTransferrable(value)) {
    transferrables.push(value)
    return undefined
  }
  if (Array.isArray(value)) {
    const newItems = []
    for (const item of value) {
      const newItem: any = walkValue(item, transferrables)
      newItems.push(newItem)
    }
    return newItems
  }
  if (typeof value === 'object') {
    const newObject = Object.create(null)
    for (const [key, property] of Object.entries(value)) {
      const newValue = walkValue(property, transferrables)
      newObject[key] = newValue
    }
    return newObject
  }
  return value
}
