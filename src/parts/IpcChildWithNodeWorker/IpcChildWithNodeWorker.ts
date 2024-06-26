import { IpcError } from '../IpcError/IpcError.ts'
import type { MessagePort } from 'node:worker_threads'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = async () => {
  const { parentPort } = await import('node:worker_threads')
  if (!parentPort) {
    throw new IpcError('parentPort is required')
  }
  return parentPort
}

export const signal = (parentPort: MessagePort) => {
  parentPort.postMessage(ReadyMessage.readyMessage)
}

export const wrap = (parentPort: MessagePort) => {
  return {
    parentPort,
    on(event: string, listener: any) {
      const wrappedListener = (message: any) => {
        const event = {
          data: message,
          target: this,
        }
        listener(event)
      }
      this.parentPort.on(event, wrappedListener)
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
