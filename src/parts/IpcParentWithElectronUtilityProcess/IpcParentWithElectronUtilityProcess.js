import { utilityProcess } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import * as GetFirstUtilityProcessEvent from '../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.js'
import { IpcError } from '../IpcError/IpcError.js'

export const create = async ({ path, argv = [], execArgv = [], name }) => {
  Assert.string(path)
  const actualArgv = ['--ipc-type=electron-utility-process', ...argv]
  const childProcess = utilityProcess.fork(path, actualArgv, {
    execArgv,
    stdio: 'pipe',
    serviceName: name,
  })
  // @ts-ignore
  childProcess.stdout.pipe(process.stdout)
  const { type, event, stdout, stderr } = await GetFirstUtilityProcessEvent.getFirstUtilityProcessEvent(childProcess)
  if (type === FirstNodeWorkerEventType.Exit) {
    throw new IpcError(`Utility process exited before ipc connection was established`, stdout, stderr)
  }
  // @ts-ignore
  childProcess.stderr.pipe(process.stderr)
  return childProcess
}

export const wrap = (process) => {
  return {
    process,
    on(event, listener) {
      this.process.on(event, listener)
    },
    send(message) {
      this.process.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      Assert.array(transfer)
      this.process.postMessage(message, transfer)
    },
    dispose() {
      this.process.kill()
    },
  }
}
