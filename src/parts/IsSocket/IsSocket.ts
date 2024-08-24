import * as IsInstanceOf from '../IsInstanceOf/IsInstanceOf.ts'

export const isSocket = (value: unknown): boolean => {
  return IsInstanceOf.isInstanceOf(value, 'Socket')
}
