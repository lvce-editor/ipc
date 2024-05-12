import * as GetHelpfulChildProcessError from '../GetHelpfulChildProcessError/GetHelpfulChildProcessError.ts'
import { VError } from '../VError/VError.ts'

export class IpcError extends VError {
  // @ts-ignore
  constructor(betterMessage, stdout = '', stderr = '') {
    if (stdout || stderr) {
      // @ts-ignore
      const { message, code, stack } = GetHelpfulChildProcessError.getHelpfulChildProcessError(stdout, stderr)
      const cause = new Error(message)
      // @ts-ignore
      cause.code = code
      cause.stack = stack
      super(cause, betterMessage)
    } else {
      super(betterMessage)
    }
    // @ts-ignore
    this.name = 'IpcError'
    // @ts-ignore
    this.stdout = stdout
    // @ts-ignore
    this.stderr = stderr
  }
}
