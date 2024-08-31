import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

const isModuleNotFoundMessage = (line: string) => {
  return line.includes('ERR_MODULE_NOT_FOUND')
}

export const getModuleNotFoundError = (stderr: string) => {
  const lines = SplitLines.splitLines(stderr)
  const messageIndex = lines.findIndex(isModuleNotFoundMessage)
  const message = lines[messageIndex]
  return {
    message,
    code: ErrorCodes.ERR_MODULE_NOT_FOUND,
  }
}
