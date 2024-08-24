import { expect, test, beforeAll, jest } from '@jest/globals'
import * as IpcChildWithElectronWindow from '../src/parts/IpcChildWithElectronWindow/IpcChildWithElectronWindow.ts'

beforeAll(() => {
  // @ts-ignore
  globalThis.location = { origin: 'test://test' }
})

test('onMessage - ignore events with messagePorts', async () => {
  const mockWindow = new EventTarget()
  const ipc = IpcChildWithElectronWindow.wrap(mockWindow)

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
  const ipc = IpcChildWithElectronWindow.wrap(mockWindow)

  const messages: any[] = []
  const handleMessage = (event: MessageEvent) => {
    messages.push(event.data)
  }
  ipc.addEventListener('message', handleMessage)
  mockWindow.dispatchEvent(
    new MessageEvent('message', {
      data: {
        jsonrpc: '2.0',
        id: 1,
        result: 1,
      },
    }),
  )
  expect(messages).toEqual([
    {
      jsonrpc: '2.0',
      id: 1,
      result: 1,
    },
  ])
})

test('onMessage - ignore events after first message', async () => {
  const mockWindow = new EventTarget()
  const ipc = IpcChildWithElectronWindow.wrap(mockWindow)

  const messages: any[] = []
  const handleMessage = (event: MessageEvent) => {
    messages.push(event.data)
  }
  ipc.addEventListener('message', handleMessage)
  mockWindow.dispatchEvent(
    new MessageEvent('message', {
      data: {
        jsonrpc: '2.0',
        id: 1,
        result: 1,
      },
    }),
  )
  mockWindow.dispatchEvent(
    new MessageEvent('message', {
      data: {
        jsonrpc: '2.0',
        id: 2,
        result: 2,
      },
    }),
  )
  expect(messages).toEqual([
    {
      jsonrpc: '2.0',
      id: 1,
      result: 1,
    },
  ])
})

test('sendAndTransfer - move transferrable parameters to transfer array', async () => {
  const mockWindow = {
    postMessage: jest.fn(),
    addEventListener: jest.fn(),
  }
  const ipc = IpcChildWithElectronWindow.wrap(mockWindow)

  const messages: any[] = []
  const handleMessage = (event: MessageEvent) => {
    messages.push(event.data)
  }
  ipc.addEventListener('message', handleMessage)
  const { port1: port3 } = new MessageChannel()
  const message = {
    jsonrpc: '2.0',
    method: 'CreateMessagePort.createMessagePort',
    params: [1, port3],
  }
  ipc.sendAndTransfer(message, [port3])
  expect(mockWindow.postMessage).toHaveBeenCalledTimes(1)
  expect(mockWindow.postMessage).toHaveBeenCalledWith(
    {
      jsonrpc: '2.0',
      method: 'CreateMessagePort.createMessagePort',
      params: [1],
    },
    'test://test',
    [port3],
  )
})
