import type { MessagePortMain } from 'electron'
import * as GetData from '../GetData/GetData.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.ts'

export const create = ({ messagePort }: { messagePort: MessagePort }) => {
  if (!IsMessagePort.isMessagePort(messagePort)) {
    throw new IpcError('port must be of type MessagePort')
  }
  return messagePort
}

export const signal = (messagePort: MessagePortMain) => {
  messagePort.start()
}

class IpcParentWithMessagePort extends Ipc<MessagePort> {
  constructor(port: MessagePort) {
    super(port)
  }

  override getData = GetData.getData

  override send(message: any) {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any): void {
    throw new Error('not implemented')
  }

  override dispose(): void {
    this._rawIpc.close()
  }

  override onMessage(callback: any) {
    this._rawIpc.addEventListener('message', callback)
  }

  override onClose(callback: any) {}
}

export const wrap = (messagePort: any) => {
  return new IpcParentWithMessagePort(messagePort)
}
