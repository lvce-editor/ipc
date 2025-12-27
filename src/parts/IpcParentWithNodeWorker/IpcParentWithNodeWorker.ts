import type { Worker } from 'node:worker_threads'
import * as Assert from '../Assert/Assert.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as FixNodeWorkerParameters from '../FixNodeWorkerParameters/FixNodeWorkerParameters.ts'
import * as GetFirstNodeWorkerEvent from '../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export interface IpcParentWithNodeWorkerOptions {
  readonly argv?: readonly string[]
  readonly env?: any
  readonly execArgv?: string[]
  readonly name?: 'inherit' | undefined
  readonly path: string
  readonly stdio?: 'inherit' | undefined
}

export const create = async ({ argv = [], env = process.env, execArgv = [], name, path, stdio }: IpcParentWithNodeWorkerOptions) => {
  Assert.string(path)
  const actualArgv = ['--ipc-type=node-worker', ...argv]
  const actualEnv = {
    ...env,
    ELECTRON_RUN_AS_NODE: '1',
  }
  const ignoreStdio = stdio === 'inherit' ? undefined : true
  const { Worker } = await import('node:worker_threads')
  const worker = new Worker(path, {
    argv: actualArgv,
    env: actualEnv,
    execArgv,
    name,
    stderr: ignoreStdio,
    stdout: ignoreStdio,
  })
  const { event, type } = await GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent(worker)
  if (type === FirstNodeWorkerEventType.Exit) {
    throw new IpcError(`Worker exited before ipc connection was established`)
  }
  if (type === FirstNodeWorkerEventType.Error) {
    throw new IpcError(`Worker threw an error before ipc connection was established: ${event}`)
  }
  if (event !== ReadyMessage.readyMessage) {
    throw new IpcError('unexpected first message from worker')
  }
  return worker
}

class IpcParentWithNodeWorker extends Ipc<Worker> {
  override getData(message: any) {
    return message
  }

  override send(message: any) {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any): void {
    const { newValue, transfer } = FixNodeWorkerParameters.fixNodeWorkerParameters(message)
    this._rawIpc.postMessage(newValue, transfer)
  }

  override async dispose(): Promise<void> {
    await this._rawIpc.terminate()
  }

  override onClose(callback: any) {
    this._rawIpc.on('exit', callback)
  }

  override onMessage(callback: any) {
    this._rawIpc.on('message', callback)
  }
}

export const wrap = (worker: Worker) => {
  return new IpcParentWithNodeWorker(worker)
}
