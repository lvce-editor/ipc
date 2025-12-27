import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

// @ts-ignore
export const getFirstWebSocketEvent = async (webSocket) => {
  // @ts-ignore
  const { WebSocket } = await import('ws')

  switch (webSocket.readyState) {
    case WebSocket.CLOSED:
      return {
        event: undefined,
        type: FirstWebSocketEventType.Close,
      }
    case WebSocket.OPEN:
      return {
        event: undefined,
        type: FirstWebSocketEventType.Open,
      }
    default:
      break
  }
  // @ts-ignore
  const { event, type } = await GetFirstEvent.getFirstEvent(webSocket, {
    close: FirstWebSocketEventType.Close,
    open: FirstWebSocketEventType.Open,
  })
  return { event, type }
}
