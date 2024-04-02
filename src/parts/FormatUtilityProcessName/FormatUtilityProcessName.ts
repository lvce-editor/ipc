import * as CamelCase from '../CamelCase/CamelCase.ts'

export const formatUtilityProcessName = (name: string) => {
  return CamelCase.camelCase(name)
}
