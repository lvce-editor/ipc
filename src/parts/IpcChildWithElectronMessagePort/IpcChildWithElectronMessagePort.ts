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

class IpcChildWithElectronMessagePort extends Ipc<MessagePort> {
  constructor(port: MessagePort) {
    super(port)
  }

  override getData(event: MessageEvent) {
    return getActualData(event)
  }

  override send(message: any) {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any, transfer: any): void {
    this._rawIpc.postMessage(message, transfer)
  }

  override dispose(): void {
    this._rawIpc.close()
  }
}

export const wrap = (messagePort: any) => {
  return new IpcChildWithElectronMessagePort(messagePort)
}
