import type { MessagePortMain } from 'electron'
import * as GetUtilityProcessPortData from '../GetUtilityProcessPortData/GetUtilityProcessPortData.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = () => {
  // @ts-ignore
  const { parentPort } = process
  if (!parentPort) {
    throw new Error('parent port must be defined')
  }
  return parentPort
}

export const signal = (parentPort: any) => {
  parentPort.postMessage(ReadyMessage.readyMessage)
}

class IpcChildWithElectronUtilityProcess extends Ipc<MessagePortMain> {
  override getData(event: any) {
    return GetUtilityProcessPortData.getUtilityProcessPortData(event)
  }

  override send(message: any): void {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any, transfer: any): void {
    this._rawIpc.postMessage(message, transfer)
  }

  override dispose(): void {
    this._rawIpc.close()
  }

  override onClose(callback: any) {
    this._rawIpc.on('close', callback)
  }

  override onMessage(callback: any) {
    this._rawIpc.on('message', callback)
  }
}

export const wrap = (parentPort: any) => {
  return new IpcChildWithElectronUtilityProcess(parentPort)
}
