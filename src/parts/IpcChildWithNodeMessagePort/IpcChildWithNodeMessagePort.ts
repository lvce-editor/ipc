import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.ts'

export const listen = async ({ messagePort }: { messagePort: unknown }) => {
  if (!IsMessagePort.isMessagePort(messagePort)) {
    throw new IpcError(`port must be of type MessagePort`)
  }
  return messagePort
}

export const signal = (messagePort: any) => {
  messagePort.start()
}

export const wrap = (port: any) => {
  return {
    port,
    on(event: any, listener: any) {
      const wrappedListener = (message: any) => {
        const event = {
          data: message,
          target: this,
        }
        listener(event)
      }
      this.port.on(event, wrappedListener)
    },
    off(event: any, listener: any) {
      this.port.off(event, listener)
    },
    send(message: any) {
      this.port.postMessage(message)
    },
    dispose() {
      this.port.close()
    },
    start() {
      throw new Error('start method is deprecated')
    },
  }
}
