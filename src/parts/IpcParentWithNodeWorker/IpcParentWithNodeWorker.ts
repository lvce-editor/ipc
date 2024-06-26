import * as Assert from '../Assert/Assert.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as GetFirstNodeWorkerEvent from '../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

// @ts-ignore
export const create = async ({ path, argv = [], env = process.env, execArgv = [] }) => {
  // @ts-ignore
  Assert.string(path)
  const actualArgv = ['--ipc-type=node-worker', ...argv]
  const actualEnv = {
    ...env,
    ELECTRON_RUN_AS_NODE: '1',
  }
  const { Worker } = await import('node:worker_threads')
  const worker = new Worker(path, {
    argv: actualArgv,
    env: actualEnv,
    execArgv,
  })
  // @ts-ignore
  const { type, event } = await GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent(worker)
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

// @ts-ignore
export const wrap = (worker) => {
  return {
    worker,
    // @ts-ignore
    on(event, listener) {
      const wrappedListener = (message: any) => {
        const syntheticEvent = {
          data: message,
          target: this,
        }
        listener(syntheticEvent)
      }
      this.worker.on(event, wrappedListener)
    },
    // @ts-ignore
    send(message) {
      this.worker.postMessage(message)
    },
    // @ts-ignore
    sendAndTransfer(message, transfer) {
      Assert.array(transfer)
      this.worker.postMessage(message, transfer)
    },
    dispose() {
      this.worker.terminate()
    },
  }
}
