import * as GetData from '../GetData/GetData.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'
import { Ipc } from '../Ipc/Ipc.ts'

interface CreateOptions {
  readonly name: string
  readonly sendPort: ({ name, port, url }: { port: MessagePort; url: string; name: string }) => Promise<void>
  readonly url: string
}

export const create = async ({ name, sendPort, url }: CreateOptions) => {
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await sendPort({
    name,
    port: port1,
    url,
  })
  return port2
}

export const signal = (messagePort: MessagePort) => {
  messagePort.start()
}

class IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug extends Ipc<MessagePort> {
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
    this._rawIpc.start()
  }

  override onClose(callback: any) {
    // ignore
  }
}

export const wrap = (messagePort: MessagePort) => {
  return new IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug(messagePort)
}
