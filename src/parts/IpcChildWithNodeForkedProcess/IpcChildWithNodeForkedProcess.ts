import type { NodeJsProcess } from '../NodeJsProcess/NodeJsProcess.ts'
import * as GetActualDataNode from '../GetActualDataNode/GetActualDataNode.ts'
import * as GetTransferrablesNode from '../GetTransferrablesNode/GetTransferrablesNode.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'
import { IpcError } from '../IpcError/IpcError.ts'

export const listen = async () => {
  if (!process.send) {
    throw new IpcError('process.send must be defined')
  }
  return process
}

export const signal = (process: NodeJsProcess) => {
  process.send(ReadyMessage.readyMessage)
}

class IpcChildWithNodeForkedProcess extends Ipc<NodeJsProcess> {
  override getData(message: any, handle: any) {
    return GetActualDataNode.getActualData(message, handle)
  }

  override onClose(callback: any) {
    this._rawIpc.on('close', callback)
  }

  override send(message: any) {
    this._rawIpc.send(message)
  }

  override onMessage(callback: any) {
    this._rawIpc.on('message', callback)
  }

  override sendAndTransfer(message: any): void {
    const transfer = GetTransferrablesNode.getTransferrablesNode(message)
    this._rawIpc.send(message, transfer)
  }

  override dispose(): void {
    // ignore
  }
}

export const wrap = (process: NodeJsProcess) => {
  return new IpcChildWithNodeForkedProcess(process)
}
