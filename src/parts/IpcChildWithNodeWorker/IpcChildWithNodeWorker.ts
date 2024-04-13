import { IpcError } from '../IpcError/IpcError.js'
import type { MessagePort } from 'node:worker_threads'

export const listen = async () => {
  const { parentPort } = await import('node:worker_threads')
  if (!parentPort) {
    throw new IpcError('parentPort is required')
  }
  return parentPort
}

export const signal = (parentPort: MessagePort) => {
  parentPort.postMessage('ready')
}

export const wrap = (parentPort: MessagePort) => {
  return {
    parentPort,
    on(event: string, listener: any) {
      this.parentPort.on(event, listener)
    },
    off(event: string, listener: any) {
      this.parentPort.off(event, listener)
    },
    send(message: any) {
      this.parentPort.postMessage(message)
    },
    dispose() {
      this.parentPort.close()
    },
  }
}
