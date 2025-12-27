import { expect, test } from '@jest/globals'
import * as IpcChildWithWindow from '../src/parts/IpcChildWithWindow/IpcChildWithWindow.ts'

test('onMessage - ignore events with messagePorts', async () => {
  const mockWindow = new EventTarget()
  const ipc = IpcChildWithWindow.wrap(mockWindow)

  const messages: any[] = []
  const handleMessage = (event: MessageEvent) => {
    messages.push(event.data)
  }
  ipc.addEventListener('message', handleMessage)
  const { port1 } = new MessageChannel()
  mockWindow.dispatchEvent(
    new MessageEvent('message', {
      ports: [port1],
    }),
  )
  expect(messages).toHaveLength(0)
})

test('onMessage - forward message events', async () => {
  const mockWindow = new EventTarget()
  const ipc = IpcChildWithWindow.wrap(mockWindow)

  const messages: any[] = []
  const handleMessage = (event: MessageEvent) => {
    messages.push(event.data)
  }
  ipc.addEventListener('message', handleMessage)
  mockWindow.dispatchEvent(
    new MessageEvent('message', {
      data: {
        id: 1,
        jsonrpc: '2.0',
        result: 1,
      },
    }),
  )
  expect(messages).toEqual([
    {
      id: 1,
      jsonrpc: '2.0',
      result: 1,
    },
  ])
})

test('onMessage - ignore events after first message', async () => {
  const mockWindow = new EventTarget()
  const ipc = IpcChildWithWindow.wrap(mockWindow)

  const messages: any[] = []
  const handleMessage = (event: MessageEvent) => {
    messages.push(event.data)
  }
  ipc.addEventListener('message', handleMessage)
  mockWindow.dispatchEvent(
    new MessageEvent('message', {
      data: {
        id: 1,
        jsonrpc: '2.0',
        result: 1,
      },
    }),
  )
  mockWindow.dispatchEvent(
    new MessageEvent('message', {
      data: {
        id: 2,
        jsonrpc: '2.0',
        result: 2,
      },
    }),
  )
  expect(messages).toEqual([
    {
      id: 1,
      jsonrpc: '2.0',
      result: 1,
    },
  ])
})
