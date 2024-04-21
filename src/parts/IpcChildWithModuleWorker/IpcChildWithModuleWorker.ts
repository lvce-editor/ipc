import * as GetData from '../GetData/GetData.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = () => {
  // @ts-ignore
  if (typeof WorkerGlobalScope === 'undefined') {
    throw new TypeError('module is not in web worker scope')
  }
  return globalThis
}

export const signal = (global: any) => {
  global.postMessage(ReadyMessage.readyMessage)
}

class IpcChildWithModuleWorker extends Ipc<WorkerGlobalScope> {
  override getData(event: any) {
    return GetData.getData(event)
  }

  override send(message: any): void {
    // @ts-ignore
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any, transfer: any): void {
    // @ts-ignore
    this._rawIpc.postMessage(message, transfer)
  }

  override dispose(): void {
    // ignore
  }
}

export const wrap = (global: any) => {
  return new IpcChildWithModuleWorker(global)
}
