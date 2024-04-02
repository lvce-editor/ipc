import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'

const RE_NATIVE_MODULE_ERROR = /^innerError Error: Cannot find module '.*.node'/
const RE_NATIVE_MODULE_ERROR_2 = /was compiled against a different Node.js version/

const RE_MESSAGE_CODE_BLOCK_START = /^Error: The module '.*'$/
const RE_MESSAGE_CODE_BLOCK_END = /^\s* at/

const RE_AT = /^\s+at/
const RE_AT_PROMISE_INDEX = /^\s*at async Promise.all \(index \d+\)$/

// @ts-ignore
const isUnhelpfulNativeModuleError = (stderr) => {
  return RE_NATIVE_MODULE_ERROR.test(stderr) && RE_NATIVE_MODULE_ERROR_2.test(stderr)
}

// @ts-ignore
const isMessageCodeBlockStartIndex = (line) => {
  return RE_MESSAGE_CODE_BLOCK_START.test(line)
}

// @ts-ignore
const isMessageCodeBlockEndIndex = (line) => {
  return RE_MESSAGE_CODE_BLOCK_END.test(line)
}

// @ts-ignore
const getMessageCodeBlock = (stderr) => {
  const lines = SplitLines.splitLines(stderr)
  const startIndex = lines.findIndex(isMessageCodeBlockStartIndex)
  const endIndex = startIndex + lines.slice(startIndex).findIndex(isMessageCodeBlockEndIndex, startIndex)
  const relevantLines = lines.slice(startIndex, endIndex)
  const relevantMessage = relevantLines.join(' ').slice('Error: '.length)
  return relevantMessage
}

// @ts-ignore
const getNativeModuleErrorMessage = (stderr) => {
  const message = getMessageCodeBlock(stderr)
  return {
    message: `Incompatible native node module: ${message}`,
    code: ErrorCodes.E_INCOMPATIBLE_NATIVE_MODULE,
  }
}

// @ts-ignore
const isModulesSyntaxError = (stderr) => {
  if (!stderr) {
    return false
  }
  return stderr.includes('SyntaxError: Cannot use import statement outside a module')
}

// @ts-ignore
const getModuleSyntaxError = (stderr) => {
  return {
    message: `ES Modules are not supported in electron`,
    code: ErrorCodes.E_MODULES_NOT_SUPPORTED_IN_ELECTRON,
  }
}

// @ts-ignore
const isModuleNotFoundError = (stderr) => {
  if (!stderr) {
    return false
  }
  return stderr.includes('ERR_MODULE_NOT_FOUND')
}

// @ts-ignore
const isModuleNotFoundMessage = (line) => {
  return line.includes('ERR_MODULE_NOT_FOUND')
}

// @ts-ignore
const getModuleNotFoundError = (stderr) => {
  const lines = SplitLines.splitLines(stderr)
  const messageIndex = lines.findIndex(isModuleNotFoundMessage)
  const message = lines[messageIndex]
  return {
    message,
    code: ErrorCodes.ERR_MODULE_NOT_FOUND,
  }
}

// @ts-ignore
const isNormalStackLine = (line) => {
  return RE_AT.test(line) && !RE_AT_PROMISE_INDEX.test(line)
}

// @ts-ignore
const getDetails = (lines) => {
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

// @ts-ignore
export const getHelpfulChildProcessError = (stdout, stderr) => {
  if (isUnhelpfulNativeModuleError(stderr)) {
    return getNativeModuleErrorMessage(stderr)
  }
  if (isModulesSyntaxError(stderr)) {
    return getModuleSyntaxError(stderr)
  }
  if (isModuleNotFoundError(stderr)) {
    return getModuleNotFoundError(stderr)
  }
  const lines = SplitLines.splitLines(stderr)
  const { actualMessage, rest } = getDetails(lines)
  return {
    message: `${actualMessage}`,
    code: '',
    stack: rest,
  }
}
