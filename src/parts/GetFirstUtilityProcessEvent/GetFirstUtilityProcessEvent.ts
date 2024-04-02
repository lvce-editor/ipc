import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as Promises from '../Promises/Promises.ts'

/**
 *
 * @param {any} utilityProcess
 * @returns
 */
// @ts-ignore
export const getFirstUtilityProcessEvent = async (utilityProcess) => {
  const { resolve, promise } = Promises.withResolvers()
  let stdout = ''
  let stderr = ''
  // @ts-ignore
  const cleanup = (value) => {
    // @ts-ignore
    utilityProcess.stderr.off('data', handleStdErrData)
    // @ts-ignore
    utilityProcess.stdout.off('data', handleStdoutData)
    utilityProcess.off('message', handleMessage)
    utilityProcess.off('exit', handleExit)
    // @ts-ignore
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
  utilityProcess.stderr.on('data', handleStdErrData)
  // @ts-ignore
  utilityProcess.stdout.on('data', handleStdoutData)
  utilityProcess.on('message', handleMessage)
  utilityProcess.on('exit', handleExit)
  // @ts-ignore
  const { type, event } = await promise
  return { type, event, stdout, stderr }
}
