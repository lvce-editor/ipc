import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

export const waitForWebSocketToBeOpen = (webSocket: WebSocket) => {
  return GetFirstEvent.getFirstEvent(webSocket, {
    open: FirstWebSocketEventType.Open,
    close: FirstWebSocketEventType.Close,
    error: FirstWebSocketEventType.Error,
  })
}
