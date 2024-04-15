import * as Assert from '../Assert/Assert.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as GetFirstUtilityProcessEvent from '../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.ts'
import { IpcError } from '../IpcError/IpcError.ts'

// @ts-ignore
export const create = async ({ path, argv = [], execArgv = [], name, env = process.env }) => {
  Assert.string(path)
  const actualArgv = ['--ipc-type=electron-utility-process', ...argv]
  // @ts-ignore
  const { utilityProcess } = await import('electron')
  const childProcess = utilityProcess.fork(path, actualArgv, {
    execArgv,
    stdio: 'pipe',
    serviceName: name,
    env,
  })
  // @ts-ignore
  childProcess.stdout.pipe(process.stdout)
  const { type, stdout, stderr } = await GetFirstUtilityProcessEvent.getFirstUtilityProcessEvent(childProcess)
  if (type === FirstNodeWorkerEventType.Exit) {
    throw new IpcError(`Utility process exited before ipc connection was established`, stdout, stderr)
  }
  // @ts-ignore
  childProcess.stderr.pipe(process.stderr)
  return childProcess
}

// @ts-ignore
export const wrap = (process) => {
  return {
    process,
    // @ts-ignore
    on(event, listener) {
      const wrappedListener = (message: any) => {
        const syntheticEvent = {
          data: message,
          target: this,
        }
        listener(syntheticEvent)
      }
      this.process.on(event, wrappedListener)
    },
    // @ts-ignore
    send(message) {
      this.process.postMessage(message)
    },
    // @ts-ignore
    sendAndTransfer(message, transfer) {
      Assert.array(transfer)
      this.process.postMessage(message, transfer)
    },
    dispose() {
      this.process.kill()
    },
  }
}
