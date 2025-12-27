import type { ChildProcess } from 'node:child_process'
import type { FirstChildProcessEvent } from '../FirstChildProcessEvent/FirstChildProcessEvent.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'

export const getFirstNodeChildProcessEvent = async (childProcess: ChildProcess): Promise<FirstChildProcessEvent> => {
  const { event, stderr, stdout, type } = await new Promise<FirstChildProcessEvent>((resolve, reject) => {
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
      cleanup({ event, stderr, stdout, type: FirstNodeWorkerEventType.Message })
    }
    const handleExit = (event: any): void => {
      cleanup({ event, stderr, stdout, type: FirstNodeWorkerEventType.Exit })
    }
    const handleError = (event: any): void => {
      cleanup({ event, stderr, stdout, type: FirstNodeWorkerEventType.Error })
    }
    if (childProcess.stdout && childProcess.stderr) {
      childProcess.stderr.on('data', handleStdErrData)
      childProcess.stdout.on('data', handleStdoutData)
    }
    childProcess.on('message', handleMessage)
    childProcess.on('exit', handleExit)
    childProcess.on('error', handleError)
  })
  return { event, stderr, stdout, type }
}
