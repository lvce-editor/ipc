import { VError } from '../VError/VError.ts'

export const stringifyCompact = (value: any) => {
  return JSON.stringify(value)
}

export const parse = (content: string) => {
  if (content === 'undefined') {
    return null
  }
  try {
    return JSON.parse(content)
  } catch (error) {
    throw new VError(error, 'failed to parse json')
  }
}
