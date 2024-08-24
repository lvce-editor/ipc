import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.ts'
import { Ipc } from '../Ipc/Ipc.ts'
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

class IpcParentWithWebSocket extends Ipc<WebSocket> {
  override getData(event: any) {
    return Json.parse(event.data)
  }

  override send(message: any): void {
    this._rawIpc.send(Json.stringifyCompact(message))
  }

  override sendAndTransfer(message: any): void {
    throw new Error('sendAndTransfer not supported')
  }

  override dispose(): void {
    this._rawIpc.close()
  }

  override onClose(callback: any) {
    this._rawIpc.addEventListener('close', callback)
  }

  override onMessage(callback: any) {
    this._rawIpc.addEventListener('message', callback)
  }
}

export const wrap = (webSocket: WebSocket) => {
  return new IpcParentWithWebSocket(webSocket)
}
