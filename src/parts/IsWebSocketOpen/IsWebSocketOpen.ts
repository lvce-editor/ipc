export const isWebSocketOpen = async (webSocket) => {
  const { WebSocket } = await import('ws')
  return webSocket.readyState === WebSocket.OPEN
}
