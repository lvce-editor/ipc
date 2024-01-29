import * as GetHelpfulChildProcessError from '../GetHelpfulChildProcessError/GetHelpfulChildProcessError.js'
import { VError } from '../VError/VError.js'

export class IpcError extends VError {
  constructor(message, stdout = '', stderr = '') {
    if (stdout || stderr) {
      const { message, code, stack } = GetHelpfulChildProcessError.getHelpfulChildProcessError(stdout, stderr)
      const cause = new Error(message)
      // @ts-ignore
      cause.code = code
      cause.stack = stack
      super(cause, message)
    } else {
      super(message)
    }
    this.name = 'IpcError'
    this.stdout = stdout
    this.stderr = stderr
  }
}
