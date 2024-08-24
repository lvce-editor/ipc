import type { MessagePortMain } from 'electron'
import * as FixElectronParameters from '../FixElectronParameters/FixElectronParameters.ts'
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

const getActualData = (event: any) => {
  const { data, ports } = event
  if (ports.length === 0) {
    return data
  }
  return {
    ...data,
    params: [...ports, ...data.params],
  }
}

class IpcChildWithElectronMessagePort extends Ipc<MessagePortMain> {
  constructor(port: MessagePortMain) {
    super(port)
  }

  override getData(event: MessageEvent) {
    return getActualData(event)
  }

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
