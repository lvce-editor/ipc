import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as GetModuleNotFoundError from '../GetModuleNotFoundError/GetModuleNotFoundError.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

const RE_NATIVE_MODULE_ERROR = /^innerError Error: Cannot find module '.*.node'/
const RE_NATIVE_MODULE_ERROR_2 = /was compiled against a different Node.js version/

const RE_MESSAGE_CODE_BLOCK_START = /^Error: The module '.*'$/
const RE_MESSAGE_CODE_BLOCK_END = /^\s* at/

const RE_AT = /^\s+at/
const RE_AT_PROMISE_INDEX = /^\s*at async Promise.all \(index \d+\)$/

const isUnhelpfulNativeModuleError = (stderr: string) => {
  return RE_NATIVE_MODULE_ERROR.test(stderr) && RE_NATIVE_MODULE_ERROR_2.test(stderr)
}

const isMessageCodeBlockStartIndex = (line: string) => {
  return RE_MESSAGE_CODE_BLOCK_START.test(line)
}

const isMessageCodeBlockEndIndex = (line: string) => {
  return RE_MESSAGE_CODE_BLOCK_END.test(line)
}

const getMessageCodeBlock = (stderr: string) => {
  const lines = SplitLines.splitLines(stderr)
  const startIndex = lines.findIndex(isMessageCodeBlockStartIndex)
  const endIndex = startIndex + lines.slice(startIndex).findIndex(isMessageCodeBlockEndIndex, startIndex)
  const relevantLines = lines.slice(startIndex, endIndex)
  const relevantMessage = relevantLines.join(' ').slice('Error: '.length)
  return relevantMessage
}

const getNativeModuleErrorMessage = (stderr: string) => {
  const message = getMessageCodeBlock(stderr)
  return {
    message: `Incompatible native node module: ${message}`,
    code: ErrorCodes.E_INCOMPATIBLE_NATIVE_MODULE,
  }
}

const isModulesSyntaxError = (stderr: string) => {
  if (!stderr) {
    return false
  }
  return stderr.includes('SyntaxError: Cannot use import statement outside a module')
}

const getModuleSyntaxError = () => {
  return {
    message: `ES Modules are not supported in electron`,
    code: ErrorCodes.E_MODULES_NOT_SUPPORTED_IN_ELECTRON,
  }
}

const isModuleNotFoundError = (stderr: string) => {
  if (!stderr) {
    return false
  }
  return stderr.includes('ERR_MODULE_NOT_FOUND')
}

const isNormalStackLine = (line: string) => {
  return RE_AT.test(line) && !RE_AT_PROMISE_INDEX.test(line)
}

const getDetails = (lines: readonly string[]) => {
  const index = lines.findIndex(isNormalStackLine)
  if (index === -1) {
    return {
      actualMessage: JoinLines.joinLines(lines),
      rest: [],
    }
  }
  let lastIndex = index - 1
  while (++lastIndex < lines.length) {
    if (!isNormalStackLine(lines[lastIndex])) {
      break
    }
  }
  return {
    actualMessage: lines[index - 1],
    rest: lines.slice(index, lastIndex),
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
  const { actualMessage, rest } = getDetails(lines)
  return {
    message: actualMessage,
    code: '',
    stack: rest,
  }
}
