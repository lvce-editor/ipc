import * as CamelCase from '../CamelCase/CamelCase.ts'

// @ts-ignore
export const formatUtilityProcessName = (name) => {
  return CamelCase.camelCase(name)
}
