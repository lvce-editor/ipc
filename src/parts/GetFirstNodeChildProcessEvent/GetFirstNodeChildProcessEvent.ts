import type { ChildProcess } from 'node:child_process'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import type { FirstChildProcessEvent } from '../FirstChildProcessEvent/FirstChildProcessEvent.ts'

export const getFirstNodeChildProcessEvent = async (childProcess: ChildProcess): Promise<FirstChildProcessEvent> => {
  const { type, event, stdout, stderr } = await new Promise<FirstChildProcessEvent>((resolve, reject) => {
    let stderr = ''
    let stdout = ''
    const cleanup = (value: FirstChildProcessEvent): void => {
      if (childProcess.stdout && childProcess.stderr) {
        childProcess.stderr.off('data', handleStdErrData)
        childProcess.stdout.off('data', handleStdoutData)
      }
      childProcess.off('message', handleMessage)
      childProcess.off('exit', handleExit)
      childProcess.off('error', handleError)
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
    const handleError = (event: any): void => {
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
