import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

export const waitForWebSocketToBeOpen = (webSocket: WebSocket) => {
  return GetFirstEvent.getFirstEvent(webSocket, {
    close: FirstWebSocketEventType.Close,
    error: FirstWebSocketEventType.Error,
    open: FirstWebSocketEventType.Open,
  })
}
