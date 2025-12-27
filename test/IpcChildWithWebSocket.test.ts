import { expect, jest, test } from '@jest/globals'
import { IpcError } from '../src/parts/IpcError/IpcError.js'

jest.unstable_mockModule('../src/parts/WebSocketServer/WebSocketServer.js', () => {
  return {
    handleUpgrade: jest.fn(() => {
      return {
        pause: jest.fn(),
        readyState: 1,
      }
    }),
  }
})

const IpcChildWithWebSocket = await import('../src/parts/IpcChildWithWebSocket/IpcChildWithWebSocket.js')
const WebSocketServer = await import('../src/parts/WebSocketServer/WebSocketServer.js')

test('listen - missing request', async () => {
  const request = undefined as any
  const handle = {} as any
  await expect(
    IpcChildWithWebSocket.listen({
      handle,
      request,
    }),
  ).rejects.toThrow(new IpcError('request must be defined'))
})

test('listen - missing handle', async () => {
  const request = {} as any
  const handle = undefined as any
  await expect(
    IpcChildWithWebSocket.listen({
      handle,
      request,
    }),
  ).rejects.toThrow(new IpcError('handle must be defined'))
})

test('listen', async () => {
  const request = {} as any
  const handle = {} as any
  const webSocket = await IpcChildWithWebSocket.listen({
    handle,
    request,
  })
  expect(webSocket).toBeDefined()
  expect(WebSocketServer.handleUpgrade).toHaveBeenCalledTimes(1)
  expect(WebSocketServer.handleUpgrade).toHaveBeenCalledWith({}, {})
})
