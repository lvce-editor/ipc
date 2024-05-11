import { Ipc } from '../Ipc/Ipc.ts'
import type { NodeJsProcess } from '../NodeJsProcess/NodeJsProcess.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = async () => {
  if (!process.send) {
    throw new Error('process.send must be defined')
  }
  return process
}

export const signal = (process: NodeJsProcess) => {
  process.send(ReadyMessage.readyMessage)
}

const getActualData = (message: any, handle: any) => {
  if (handle) {
    return {
      ...message,
      params: [handle, ...message.params],
    }
  }
  return message
}

class IpcChildWithNodeForkedProcess extends Ipc<NodeJsProcess> {
  constructor(process: NodeJsProcess) {
    super(process)
  }

  override getData(message: any, handle: any) {
    return getActualData(message, handle)
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

  override sendAndTransfer(message: any, transfer: any): void {
    this._rawIpc.send(message, transfer)
  }

  override dispose(): void {
    // ignore
  }
}

export const wrap = (process: NodeJsProcess) => {
  return new IpcChildWithNodeForkedProcess(process)
}
