import * as GetData from '../GetData/GetData.ts'
import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'
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

  override sendAndTransfer(message: any): void {
    const transfer = GetTransferrables.getTransferrables(message)
    // @ts-ignore
    this._rawIpc.postMessage(message, transfer)
  }

  override dispose(): void {
    // ignore
  }

  override onClose(callback: any) {
    // ignore
  }

  override onMessage(callback: any) {
    this._rawIpc.addEventListener('message', callback)
  }
}

export const wrap = (global: any) => {
  return new IpcChildWithModuleWorker(global)
}
