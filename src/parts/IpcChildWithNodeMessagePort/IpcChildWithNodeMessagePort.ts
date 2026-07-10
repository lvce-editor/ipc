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
  const wrap = {
    dispose() {
      wrap.port.close()
    },
    off(event: any, listener: any) {
      wrap.port.off(event, listener)
    },
    on(event: any, listener: any) {
      const wrappedListener = (message: any) => {
        const event = {
          data: message,
          target: wrap,
        }
        listener(event)
      }
      wrap.port.on(event, wrappedListener)
      return undefined
    },
    port,
    send(message: any) {
      wrap.port.postMessage(message)
    },
    start() {
      throw new Error('start method is deprecated')
    },
    /**
     * @type {any}
     */
    wrappedListener: undefined,
  }
  return wrap
}
