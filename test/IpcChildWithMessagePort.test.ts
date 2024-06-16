import { expect, test } from '@jest/globals'
import * as IpcChildWithMessagePort from '../src/parts/IpcChildWithMessagePort/IpcChildWithMessagePort.ts'

test('listen - return port', async () => {
  const { port1, port2 } = new MessageChannel()
  expect(IpcChildWithMessagePort.listen({ port: port1 })).toBe(port1)
  port1.close()
  port2.close()
})

test('signal', async () => {
  const { port1, port2 } = new MessageChannel()
  const promise = new Promise((resolve) => {
    port2.onmessage = resolve
  })
  IpcChildWithMessagePort.signal(port1)
  const event = await promise
  // @ts-ignore
  expect(event.data).toBe('ready')
  port1.close()
  port2.close()
})

test('wrap - send', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = IpcChildWithMessagePort.wrap(port1)
  const promise = new Promise((resolve) => {
    port2.onmessage = resolve
  })
  ipc.send('test')
  const event = await promise
  // @ts-ignore
  expect(event.data).toBe('test')
  port1.close()
  port2.close()
})

test('wrap - sendAndTransfer', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = IpcChildWithMessagePort.wrap(port1)
  const promise = new Promise((resolve) => {
    port2.onmessage = resolve
  })
  ipc.sendAndTransfer('test', [])
  const event = await promise
  // @ts-ignore
  expect(event.data).toBe('test')
  port1.close()
  port2.close()
})

test('wrap - onMessage', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = IpcChildWithMessagePort.wrap(port1)
  const promise = new Promise((resolve) => {
    ipc.onMessage(resolve)
  })
  port2.postMessage('test')
  const event = await promise
  // @ts-ignore
  expect(event.data).toBe('test')
  port1.close()
  port2.close()
})
