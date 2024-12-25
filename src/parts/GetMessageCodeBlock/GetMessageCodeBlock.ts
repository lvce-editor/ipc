import * as SplitLines from '../SplitLines/SplitLines.ts'

const RE_MESSAGE_CODE_BLOCK_START = /^Error: The module '.*'$/
const RE_MESSAGE_CODE_BLOCK_END = /^\s* at/

const isMessageCodeBlockStartIndex = (line: string) => {
  return RE_MESSAGE_CODE_BLOCK_START.test(line)
}

const isMessageCodeBlockEndIndex = (line: string) => {
  return RE_MESSAGE_CODE_BLOCK_END.test(line)
}

export const getMessageCodeBlock = (stderr: string) => {
  const lines = SplitLines.splitLines(stderr)
  const startIndex = lines.findIndex(isMessageCodeBlockStartIndex)
  const endIndex = startIndex + lines.slice(startIndex).findIndex(isMessageCodeBlockEndIndex, startIndex)
  const relevantLines = lines.slice(startIndex, endIndex)
  const relevantMessage = relevantLines.join(' ').slice('Error: '.length)
  return relevantMessage
}
