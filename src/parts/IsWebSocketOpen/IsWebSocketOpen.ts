// @ts-ignore
export const isWebSocketOpen = async (webSocket) => {
  // @ts-ignore
  const { WebSocket } = await import('ws')
  return webSocket.readyState === WebSocket.OPEN
}
