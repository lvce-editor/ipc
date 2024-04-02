import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'

// @ts-ignore
export const getFirstNodeChildProcessEvent = async (childProcess) => {
  // @ts-ignore
  const { type, event, stdout, stderr } = await new Promise((resolve, reject) => {
    let stderr = ''
    let stdout = ''
    // @ts-ignore
    const cleanup = (value) => {
      if (childProcess.stdout && childProcess.stderr) {
        childProcess.stderr.off('data', handleStdErrData)
        childProcess.stdout.off('data', handleStdoutData)
      }
      childProcess.off('message', handleMessage)
      childProcess.off('exit', handleExit)
      childProcess.off('error', handleError)
      resolve(value)
    }
    // @ts-ignore
    const handleStdErrData = (data) => {
      stderr += data
    }
    // @ts-ignore
    const handleStdoutData = (data) => {
      stdout += data
    }
    // @ts-ignore
    const handleMessage = (event) => {
      cleanup({ type: FirstNodeWorkerEventType.Message, event, stdout, stderr })
    }
    // @ts-ignore
    const handleExit = (event) => {
      cleanup({ type: FirstNodeWorkerEventType.Exit, event, stdout, stderr })
    }
    // @ts-ignore
    const handleError = (event) => {
      cleanup({ type: FirstNodeWorkerEventType.Error, event, stdout, stderr })
    }
    if (childProcess.stdout && childProcess.stderr) {
      childProcess.stderr.on('data', handleStdErrData)
      childProcess.stdout.on('data', handleStdoutData)
    }
    childProcess.on('message', handleMessage)
    childProcess.on('exit', handleExit)
    childProcess.on('error', handleError)
  })
  return { type, event, stdout, stderr }
}
