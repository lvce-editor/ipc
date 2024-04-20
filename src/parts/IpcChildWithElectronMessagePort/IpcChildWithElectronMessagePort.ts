import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.ts'

export const listen = ({ messagePort }: { messagePort: any }) => {
  if (!IsMessagePortMain.isMessagePortMain(messagePort)) {
    throw new IpcError('port must be of type MessagePortMain')
  }
  return messagePort
}

export const signal = (messagePort: any) => {
  messagePort.start()
}

const getActualData = (event: any) => {
  const { data, ports } = event
  if (ports.length === 0) {
    return data
  }
  return {
    ...data,
    params: [...ports, ...data.params],
  }
}

export const wrap = (messagePort: any) => {
  return {
    messagePort,
    on(event: string, listener: any) {
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
    off(event: string, listener: any) {
      this.messagePort.off(event, listener)
    },
    send(message: any) {
      this.messagePort.postMessage(message)
    },
    dispose() {
      this.messagePort.close()
    },
    start() {
      throw new Error('start method is deprecated')
    },
  }
}
