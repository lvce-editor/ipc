import type { UtilityProcess } from 'electron'
import * as Assert from '../Assert/Assert.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as FixElectronParameters from '../FixElectronParameters/FixElectronParameters.ts'
import * as GetFirstUtilityProcessEvent from '../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import { IpcError } from '../IpcError/IpcError.ts'

// @ts-ignore
export const create = async ({ path, argv = [], execArgv = [], name, env = process.env }) => {
  Assert.string(path)
  const actualArgv = ['--ipc-type=electron-utility-process', ...argv]
  const { utilityProcess } = await import('electron')
  const childProcess = utilityProcess.fork(path, actualArgv, {
    execArgv,
    stdio: 'pipe',
    serviceName: name,
    env,
  })
  const handleExit = () => {
    // @ts-ignore
    childProcess.stdout.unpipe(process.stdout)
    // @ts-ignore
    childProcess.stderr.unpipe(process.stderr)
  }
  childProcess.once('exit', handleExit)
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

class IpcParentWithElectronUtilityProcess extends Ipc<UtilityProcess> {
  override getData(data: any) {
    return data
  }

  override send(message: any): void {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any): void {
    const { newValue, transfer } = FixElectronParameters.fixElectronParameters(message)
    this._rawIpc.postMessage(newValue, transfer)
  }

  override dispose(): void {
    this._rawIpc.kill()
  }

  override onClose(callback: any) {
    this._rawIpc.on('exit', callback)
  }

  override onMessage(callback: any) {
    this._rawIpc.on('message', callback)
  }
}

export const wrap = (process: any) => {
  return new IpcParentWithElectronUtilityProcess(process)
}
