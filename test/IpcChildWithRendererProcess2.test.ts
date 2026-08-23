import { expect, jest, test } from '@jest/globals'
import * as IpcChildWithRendererProcess2 from '../src/parts/IpcChildWithRendererProcess2/IpcChildWithRendererProcess2.ts'

const createMockWebContents = () => {
  let messageListener: ((event: any, message: any) => void) | undefined
  const webContents = {
    ipc: {
      on: jest.fn((_channel: string, listener: (event: any, message: any) => void) => {
        messageListener = listener
      }),
    },
    on: jest.fn(),
    postMessage: jest.fn(),
  }
  return {
    emitMessage(event: any, message: any) {
      messageListener?.(event, message)
    },
    webContents,
  }
}

test('appends transferred ports and sender id to renderer requests', () => {
  const { emitMessage, webContents } = createMockWebContents()
  const ipc = IpcChildWithRendererProcess2.wrap(webContents as any)
  const messages: any[] = []
  ipc.addEventListener('message', (event: MessageEvent) => {
    messages.push(event.data)
  })
  const { port1 } = new MessageChannel()

  emitMessage(
    { ports: [port1], sender: { id: 42 } },
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'CreateMessagePort.createMessagePort',
      params: [7],
    },
  )

  expect(messages).toEqual([
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'CreateMessagePort.createMessagePort',
      params: [7, port1, 42],
    },
  ])
})

test('forwards renderer responses without request parameters', () => {
  const { emitMessage, webContents } = createMockWebContents()
  const ipc = IpcChildWithRendererProcess2.wrap(webContents as any)
  const messages: any[] = []
  ipc.addEventListener('message', (event: MessageEvent) => {
    messages.push(event.data)
  })
  const response = {
    id: 2,
    jsonrpc: '2.0',
    result: null,
  }

  emitMessage({ ports: [], sender: { id: 42 } }, response)

  expect(messages).toEqual([response])
})
