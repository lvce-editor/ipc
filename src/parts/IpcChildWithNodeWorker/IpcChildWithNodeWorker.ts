import type { MessagePort } from 'node:worker_threads'
import * as GetTransferrablesNode from '../GetTransferrablesNode/GetTransferrablesNode.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = async () => {
  const { parentPort } = await import('node:worker_threads')
  if (!parentPort) {
    throw new IpcError('parentPort is required for node worker threads ipc')
  }
  return parentPort
}

export const signal = (parentPort: MessagePort) => {
  parentPort.postMessage(ReadyMessage.readyMessage)
}

class IpcChildWithNodeWorker extends Ipc<MessagePort> {
  override getData(data: any) {
    return data
  }

  override onClose(callback: any) {
    this._rawIpc.on('close', callback)
  }

  override send(message: any) {
    this._rawIpc.postMessage(message)
  }

  override onMessage(callback: any) {
    this._rawIpc.on('message', callback)
  }

  override sendAndTransfer(message: any): void {
    const transfer = GetTransferrablesNode.getTransferrablesNode(message)
    this._rawIpc.postMessage(message, transfer)
  }

  override dispose(): void {
    this._rawIpc.close()
  }
}

export const wrap = (parentPort: MessagePort) => {
  return new IpcChildWithNodeWorker(parentPort)
}
