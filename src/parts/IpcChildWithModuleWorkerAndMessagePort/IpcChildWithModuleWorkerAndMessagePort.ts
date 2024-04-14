import * as GetData from '../GetData/GetData.ts'
import * as IpcChildWithModuleWorker from '../IpcChildWithModuleWorker/IpcChildWithModuleWorker.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as WaitForFirstMessage from '../WaitForFirstMessage/WaitForFirstMessage.ts'

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
    parentIpc.dispose()
    const port = firstMessage.params[1]
    return port
  }
  return globalThis
}

export const wrap = (port: any) => {
  return {
    port,
    /**
     * @type {any}
     */
    wrappedListener: undefined,
    send(message: any) {
      this.port.postMessage(message)
    },
    sendAndTransfer(message: any, transferables: any) {
      this.port.postMessage(message, transferables)
    },
    get onmessage() {
      return this.wrappedListener
    },
    set onmessage(listener) {
      if (listener) {
        // @ts-expect-error
        this.wrappedListener = (event) => {
          const data = GetData.getData(event)
          // @ts-expect-error
          listener({ data, target: this })
        }
      } else {
        this.wrappedListener = undefined
      }
      this.port.onmessage = this.wrappedListener
    },
  }
}
