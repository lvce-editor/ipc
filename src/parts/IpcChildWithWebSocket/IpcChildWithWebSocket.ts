import type { Socket } from 'node:net'
import type { Request } from '../Request/Request.ts'
import * as GetFirstWebSocketEvent from '../GetFirstWebSocketEvent/GetFirstWebSocketEvent.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IsWebSocketOpen from '../IsWebSocketOpen/IsWebSocketOpen.ts'
import * as WebSocketSerialization from '../WebSocketSerialization/WebSocketSerialization.ts'
import * as WebSocketServer from '../WebSocketServer/WebSocketServer.ts'

export const listen = async ({ request, handle }: { request: Request; handle: Socket }) => {
  if (!request) {
    throw new IpcError('request must be defined')
  }
  if (!handle) {
    throw new IpcError('handle must be defined')
  }
  const webSocket = await WebSocketServer.handleUpgrade(request, handle)
  webSocket.pause()
  if (!(await IsWebSocketOpen.isWebSocketOpen(webSocket))) {
    await GetFirstWebSocketEvent.getFirstWebSocketEvent(webSocket)
  }
  return webSocket
}

export const signal = (webSocket: any) => {
  webSocket.resume()
}

export const wrap = (webSocket: any) => {
  return {
    webSocket,
    /**
     * @type {any}
     */
    wrappedListener: undefined,
    // @ts-ignore
    on(event, listener) {
      switch (event) {
        case 'message':
          // @ts-ignore
          const wrappedListener = (message) => {
            const data = WebSocketSerialization.deserialize(message)
            const event = {
              data,
              target: this,
            }
            listener(event)
          }
          webSocket.on('message', wrappedListener)
          break
        case 'close':
          webSocket.on('close', listener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
    // @ts-ignore
    off(event, listener) {
      this.webSocket.off(event, listener)
    },
    // @ts-ignore
    send(message) {
      const stringifiedMessage = WebSocketSerialization.serialize(message)
      this.webSocket.send(stringifiedMessage)
    },
    dispose() {
      this.webSocket.close()
    },
    start() {
      throw new Error('start method is deprecated')
    },
  }
}
