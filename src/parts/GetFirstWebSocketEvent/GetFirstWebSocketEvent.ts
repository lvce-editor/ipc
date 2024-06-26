import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

// @ts-ignore
export const getFirstWebSocketEvent = async (webSocket) => {
  // @ts-ignore
  const { WebSocket } = await import('ws')

  switch (webSocket.readyState) {
    case WebSocket.OPEN:
      return {
        type: FirstWebSocketEventType.Open,
        event: undefined,
      }
    case WebSocket.CLOSED:
      return {
        type: FirstWebSocketEventType.Close,
        event: undefined,
      }
    default:
      break
  }
  // @ts-ignore
  const { type, event } = await GetFirstEvent.getFirstEvent(webSocket, {
    open: FirstWebSocketEventType.Open,
    close: FirstWebSocketEventType.Close,
  })
  return { type, event }
}
