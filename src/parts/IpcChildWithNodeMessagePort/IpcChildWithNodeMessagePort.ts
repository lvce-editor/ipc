import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'

export const listen = async ({ messagePort }: { messagePort: unknown }) => {
  if (!IsMessagePort.isMessagePort(messagePort)) {
    throw new IpcError(`port must be of type MessagePort`)
  }
  return messagePort
}

export const wrap = (port: any) => {
  return {
    port,
    on(event: any, listener: any) {
      this.port.on(event, listener)
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
      this.port.start()
    },
  }
}
