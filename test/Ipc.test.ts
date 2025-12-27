import { expect, jest, test } from '@jest/globals'
import { Ipc } from '../src/parts/Ipc/Ipc.ts'

test('name', () => {
  expect(Ipc.name).toBe('Ipc')
})

class TestIpc extends Ipc<MessagePort> {
  getData(event: MessageEvent) {
    return event.data
  }

  send(message: any): void {
    this._rawIpc.postMessage(message)
  }

  sendAndTransfer(message: any): void {
    const transfer: any = []
    this._rawIpc.postMessage(message, transfer)
  }

  dispose(): void {
    this._rawIpc.close()
  }

  onClose(callback: any) {
    // not implemented
  }

  onMessage(callback: any) {
    if (this._rawIpc && this._rawIpc.addEventListener) {
      this._rawIpc.addEventListener('message', callback)
    }
  }
}

test('addEventListener - message', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = new TestIpc(port1)
  const { promise, resolve } = Promise.withResolvers<MessageEvent>()
  ipc.addEventListener('message', resolve)
  port2.postMessage(1)
  const message = await promise
  expect(message.data).toBe(1)
  port1.close()
  port2.close()
})

test('send message - send', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = new TestIpc(port1)
  const { promise, resolve } = Promise.withResolvers<MessageEvent>()
  port2.addEventListener('message', resolve)
  ipc.send(1)
  const message = await promise
  expect(message.data).toBe(1)
  port1.close()
  port2.close()
})

test.skip('sendAndTransfer message', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = new TestIpc(port1)
  const { promise, resolve } = Promise.withResolvers<MessageEvent>()
  port2.addEventListener('message', resolve)
  const array = new Uint8Array([1])
  // @ts-ignore
  ipc.sendAndTransfer(array, [array.buffer])
  const message = await promise
  expect(message.data).toEqual(new Uint8Array([1]))
  port1.close()
  port2.close()
})

test('dispose - close', () => {
  const close = jest.fn()
  const port = {
    close,
  } as any as MessagePort
  const ipc = new TestIpc(port)
  ipc.dispose()
  expect(close).toHaveBeenCalledTimes(1)
})
