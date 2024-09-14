import * as GetData from '../GetData/GetData.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import * as IpcChildWithModuleWorker from '../IpcChildWithModuleWorker/IpcChildWithModuleWorker.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as WaitForFirstMessage from '../WaitForFirstMessage/WaitForFirstMessage.ts'
import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'

export const listen = async () => {
  const parentIpcRaw = IpcChildWithModuleWorker.listen()
  IpcChildWithModuleWorker.signal(parentIpcRaw)
  const parentIpc = IpcChildWithModuleWorker.wrap(parentIpcRaw)
  const firstMessage = await WaitForFirstMessage.waitForFirstMessage(parentIpc)
  if (firstMessage.method !== 'initialize') {
    throw new IpcError('unexpected first message')
  }
  const type = firstMessage.params[0]
  if (type === 'message-port') {
    parentIpc.send({
      jsonrpc: '2.0',
      id: firstMessage.id,
      result: null,
    })
    parentIpc.dispose()
    const port = firstMessage.params[1]
    return port
  }
  return globalThis
}

class IpcChildWithModuleWorkerAndMessagePort extends Ipc<MessagePort> {
  constructor(port: MessagePort) {
    super(port)
  }

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
    if (this._rawIpc.close) {
      this._rawIpc.close()
    }
  }

  override onClose(callback: any) {
    // ignore
  }

  override onMessage(callback: any) {
    this._rawIpc.addEventListener('message', callback)
    this._rawIpc.start()
  }
}

export const wrap = (port: any) => {
  return new IpcChildWithModuleWorkerAndMessagePort(port)
}
