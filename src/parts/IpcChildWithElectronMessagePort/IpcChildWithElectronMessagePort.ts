import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.ts'

// @ts-ignore
export const listen = ({ messagePort }) => {
  if (!IsMessagePortMain.isMessagePortMain(messagePort)) {
    throw new IpcError('port must be of type MessagePortMain')
  }
  return messagePort
}

// @ts-ignore
const getActualData = (event) => {
  const { data, ports } = event
  if (ports.length === 0) {
    return data
  }
  return {
    ...data,
    params: [...ports, ...data.params],
  }
}

// @ts-ignore
export const wrap = (messagePort) => {
  return {
    messagePort,
    // @ts-ignore
    on(event, listener) {
      if (event === 'message') {
        // @ts-ignore
        const wrappedListener = (event) => {
          const actualData = getActualData(event)
          const syntheticEvent = {
            data: actualData,
            target: this,
          }
          listener(syntheticEvent)
        }
        this.messagePort.on(event, wrappedListener)
      } else if (event === 'close') {
        this.messagePort.on('close', listener)
      } else {
        throw new Error('unsupported event type')
      }
    },
    // @ts-ignore
    off(event, listener) {
      this.messagePort.off(event, listener)
    },
    // @ts-ignore
    send(message) {
      this.messagePort.postMessage(message)
    },
    dispose() {
      this.messagePort.close()
    },
    start() {
      this.messagePort.start()
    },
  }
}
