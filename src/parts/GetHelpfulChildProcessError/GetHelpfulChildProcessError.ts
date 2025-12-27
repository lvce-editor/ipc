import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as GetDetails from '../GetDetails/GetDetails.ts'
import * as GetMessageCodeBlock from '../GetMessageCodeBlock/GetMessageCodeBlock.ts'
import * as GetModuleNotFoundError from '../GetModuleNotFoundError/GetModuleNotFoundError.ts'
import { isModuleNotFoundError } from '../IsModuleNotFoundError/IsModuleNotFoundError.ts'
import { isModulesSyntaxError } from '../IsModulesSyntaxError/IsModulesSyntaxError.ts'
import { isUnhelpfulNativeModuleError } from '../IsUnhelpfulNativeModuleError/IsUnhelpfulNativeModuleError.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

const getNativeModuleErrorMessage = (stderr: string) => {
  const message = GetMessageCodeBlock.getMessageCodeBlock(stderr)
  return {
    code: ErrorCodes.E_INCOMPATIBLE_NATIVE_MODULE,
    message: `Incompatible native node module: ${message}`,
  }
}

const getModuleSyntaxError = () => {
  return {
    code: ErrorCodes.E_MODULES_NOT_SUPPORTED_IN_ELECTRON,
    message: `ES Modules are not supported in electron`,
  }
}

export const getHelpfulChildProcessError = (stdout: string, stderr: string) => {
  if (isUnhelpfulNativeModuleError(stderr)) {
    return getNativeModuleErrorMessage(stderr)
  }
  if (isModulesSyntaxError(stderr)) {
    return getModuleSyntaxError()
  }
  if (isModuleNotFoundError(stderr)) {
    return GetModuleNotFoundError.getModuleNotFoundError(stderr)
  }
  const lines = SplitLines.splitLines(stderr)
  const { actualMessage, rest } = GetDetails.getDetails(lines)
  return {
    code: '',
    message: actualMessage,
    stack: rest,
  }
}
