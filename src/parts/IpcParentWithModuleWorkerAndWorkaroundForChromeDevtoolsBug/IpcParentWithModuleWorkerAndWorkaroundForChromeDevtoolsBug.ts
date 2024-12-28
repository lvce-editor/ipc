import type { MessagePortMain } from 'electron'
import * as GetData from '../GetData/GetData.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as GetTransferrables from '../GetTransferrables/GetTransferrables.ts'
import { Ipc } from '../Ipc/Ipc.ts'

interface CreateOptions {
  readonly sendPort: ({ port }: { port: MessagePort; url: string; name: string }) => Promise<void>
  readonly url: string
  readonly name: string
}

export const create = async ({ sendPort, url, name }: CreateOptions) => {
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await sendPort({
    port: port1,
    name,
    url,
  })
  return port2
}

export const signal = (messagePort: MessagePortMain) => {
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
