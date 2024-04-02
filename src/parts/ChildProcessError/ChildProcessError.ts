import * as GetHelpfulChildProcessError from '../GetHelpfulChildProcessError/GetHelpfulChildProcessError.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

export class ChildProcessError extends Error {
  constructor(stderr) {
    const { message, code, stack } = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
    super(message || 'child process error')
    this.name = 'ChildProcessError'
    if (code) {
      this.code = code
    }
    if (stack) {
      const lines = SplitLines.splitLines(this.stack)
      const [firstLine, ...stackLines] = lines
      const newStackLines = [firstLine, ...stack, ...stackLines]
      const newStack = JoinLines.joinLines(newStackLines)
      this.stack = newStack
    }
  }
}
