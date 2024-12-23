import type { UtilityProcess } from 'electron'
import type { FirstUtilityProcessEvent } from '../FirstUtilityProcessEvent/FirstUtilityProcessEvent.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as Promises from '../Promises/Promises.ts'

export const getFirstUtilityProcessEvent = async (utilityProcess: UtilityProcess): Promise<FirstUtilityProcessEvent> => {
  const { resolve, promise } = Promises.withResolvers<FirstUtilityProcessEvent>()
  let stdout = ''
  let stderr = ''
  const cleanup = (value: FirstUtilityProcessEvent): void => {
    // @ts-ignore
    utilityProcess.stderr.off('data', handleStdErrData)
    // @ts-ignore
    utilityProcess.stdout.off('data', handleStdoutData)
    utilityProcess.off('message', handleMessage)
    utilityProcess.off('exit', handleExit)
    resolve(value)
  }
  const handleStdErrData = (data: string): void => {
    stderr += data
  }
  const handleStdoutData = (data: string): void => {
    stdout += data
  }
  const handleMessage = (event: any): void => {
    cleanup({ type: FirstNodeWorkerEventType.Message, event, stdout, stderr })
  }
  const handleExit = (event: any): void => {
    cleanup({ type: FirstNodeWorkerEventType.Exit, event, stdout, stderr })
  }
  // @ts-ignore
  utilityProcess.stderr.on('data', handleStdErrData)
  // @ts-ignore
  utilityProcess.stdout.on('data', handleStdoutData)
  utilityProcess.on('message', handleMessage)
  utilityProcess.on('exit', handleExit)
  const { type, event } = await promise
  return { type, event, stdout, stderr }
}
