import * as GetData from '../GetData/GetData.ts'
import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = () => {
  return globalThis
}

export const signal = (global: Window) => {
  global.postMessage(ReadyMessage.readyMessage)
}

class IpcChildWithWindow extends Ipc<Window> {
  override getData(event: any) {
    return GetData.getData(event)
  }

  override send(message: any): void {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any): void {
    const transfer = GetTransferrables.getTransferrables(message)
    this._rawIpc.postMessage(message, location.origin, transfer)
  }

  override dispose(): void {
    // ignore
  }

  override onClose(callback: any) {
    // ignore
  }

  override onMessage(callback: any) {
    const wrapped = (event: MessageEvent) => {
      const { ports } = event
      if (ports.length > 0) {
        return
      }
      callback(event)
      this._rawIpc.removeEventListener('message', wrapped)
    }
    this._rawIpc.addEventListener('message', wrapped)
  }
}

export const wrap = (window: any) => {
  return new IpcChildWithWindow(window)
}
