import type { MessagePortMain } from 'electron'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as GetData from '../GetData/GetData.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'
import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const create = async ({ messagePort, isMessagePortOpen }: { messagePort: MessagePort; isMessagePortOpen: boolean }): Promise<MessagePort> => {
  if (!IsMessagePort.isMessagePort(messagePort)) {
    throw new IpcError('port must be of type MessagePort')
  }
  if (isMessagePortOpen) {
    return messagePort
  }
  const eventPromise = GetFirstEvent.getFirstEvent(messagePort, {
    message: FirstNodeWorkerEventType.Message,
  })
  messagePort.start()
  const { type, event } = await eventPromise
  if (type !== FirstNodeWorkerEventType.Message) {
    throw new IpcError('Failed to wait for ipc message')
  }
  if (event.data !== ReadyMessage.readyMessage) {
    throw new IpcError('unexpected first message')
  }
  return messagePort
}

export const signal = (messagePort: MessagePortMain) => {
  messagePort.start()
}

class IpcParentWithMessagePort extends Ipc<MessagePort> {
  override getData = GetData.getData

  override send(message: any) {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any): void {
    const transfer = GetTransferrables.getTransferrables(message)
    this._rawIpc.postMessage(message, transfer)
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
