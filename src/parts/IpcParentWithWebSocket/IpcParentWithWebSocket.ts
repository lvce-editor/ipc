import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as Json from '../Json/Json.ts'
import * as WaitForWebSocketToBeOpen from '../WaitForWebSocketToBeOpen/WaitForWebSocketToBeOpen.ts'

export const create = async ({ webSocket }: { webSocket: WebSocket }) => {
  const firstWebSocketEvent = await WaitForWebSocketToBeOpen.waitForWebSocketToBeOpen(webSocket)
  // @ts-ignore
  if (firstWebSocketEvent.type === FirstWebSocketEventType.Close) {
    throw new IpcError('Websocket connection was immediately closed')
  }
  return webSocket
}

const getData = (event: any) => {
  return Json.parse(event.data)
}

export const wrap = (webSocket: WebSocket) => {
  return {
    webSocket,
    /**
     * @type {any}
     */
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      this.listener = listener
      const wrappedListener = (event: any) => {
        const data = getData(event)
        const syntheticEvent = {
          data,
          target: this,
        }
        // @ts-ignore
        listener(syntheticEvent)
      }
      this.webSocket.onmessage = wrappedListener
    },
    send(message: any) {
      const stringifiedMessage = Json.stringifyCompact(message)
      this.webSocket.send(stringifiedMessage)
    },
  }
}
