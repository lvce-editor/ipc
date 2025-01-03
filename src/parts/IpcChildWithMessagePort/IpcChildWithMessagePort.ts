import * as GetData from '../GetData/GetData.ts'
import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = ({ port }: { port: MessagePort }) => {
  return port
}

export const signal = (port: MessagePort) => {
  port.postMessage(ReadyMessage.readyMessage)
}

class IpcChildWithMessagePort extends Ipc<MessagePort> {
  override getData(event: any) {
    return GetData.getData(event)
  }

  override send(message: any): void {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any): void {
    const transfer = GetTransferrables.getTransferrables(message)
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
    this._rawIpc.start()
  }
}

export const wrap = (port: MessagePort) => {
  return new IpcChildWithMessagePort(port)
}
