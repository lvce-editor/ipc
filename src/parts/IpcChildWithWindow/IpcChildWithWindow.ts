import * as GetData from '../GetData/GetData.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'
import * as FixElectronParameters from '../FixElectronParameters/FixElectronParameters.ts'

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

  override sendAndTransfer(message: any, _transfer: any): void {
    const { newValue, transfer } = FixElectronParameters.fixElectronParameters(message)
    this._rawIpc.postMessage(newValue, location.origin, transfer)
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
      if (ports.length) {
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
