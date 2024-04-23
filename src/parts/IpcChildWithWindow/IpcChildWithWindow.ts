import * as GetData from '../GetData/GetData.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = () => {
  return window
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

  override sendAndTransfer(message: any, transfer: any): void {
    // TODO set diffrent origin
    this._rawIpc.postMessage(message, '*', transfer)
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

export const wrap = (window: any) => {
  return new IpcChildWithWindow(window)
}
