import type { MessagePortMain } from 'electron'
import * as FixElectronParameters from '../FixElectronParameters/FixElectronParameters.ts'
import * as GetActualDataElectron from '../GetActualDataElectron/GetActualDataElectron.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.ts'

export const listen = ({ messagePort }: { messagePort: any }) => {
  if (!IsMessagePortMain.isMessagePortMain(messagePort)) {
    throw new IpcError('port must be of type MessagePortMain')
  }
  return messagePort
}

export const signal = (messagePort: any) => {
  messagePort.start()
}

class IpcChildWithElectronMessagePort extends Ipc<MessagePortMain> {
  override getData = GetActualDataElectron.getActualDataElectron

  override send(message: any) {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any): void {
    const { newValue, transfer } = FixElectronParameters.fixElectronParameters(message)
    this._rawIpc.postMessage(newValue, transfer)
  }

  override dispose(): void {
    this._rawIpc.close()
  }

  override onMessage(callback: any) {
    this._rawIpc.on('message', callback)
  }

  override onClose(callback: any) {
    this._rawIpc.on('close', callback)
  }
}

export const wrap = (messagePort: any) => {
  return new IpcChildWithElectronMessagePort(messagePort)
}
