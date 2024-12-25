import * as JoinLines from '../JoinLines/JoinLines.ts'

const RE_AT = /^\s+at/
const RE_AT_PROMISE_INDEX = /^\s*at async Promise.all \(index \d+\)$/

const isNormalStackLine = (line: string) => {
  return RE_AT.test(line) && !RE_AT_PROMISE_INDEX.test(line)
}

export const getDetails = (lines: readonly string[]) => {
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
