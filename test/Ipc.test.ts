import { Ipc } from '../src/parts/Ipc/Ipc.ts'
import { test, expect } from '@jest/globals'
import * as Promises from '../src/parts/Promises/Promises.ts'
import { jest } from '@jest/globals'
import { EventEmitter } from 'node:events'

test('name', () => {
  expect(Ipc.name).toBe('Ipc')
})

const getData = (event: any) => {
  return event.data
}

test('addEventListener onmessage', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = new Ipc(port1, getData)
  const { resolve, promise } = Promises.withResolvers<MessageEvent>()
  ipc.addEventListener('message', resolve)
  port2.postMessage(1)
  const message = await promise
  expect(message.data).toBe(1)
  port1.close()
  port2.close()
})

test('addEventListener EventEmitter', async () => {
  const emitter = new EventEmitter()
  const getData = (data: any) => {
    return data
  }
  const ipc = new Ipc(emitter, getData)
  const { resolve, promise } = Promises.withResolvers<MessageEvent>()
  ipc.addEventListener('message', resolve)
  emitter.emit('message', 1)
  const message = await promise
  expect(message.data).toBe(1)
  emitter.removeAllListeners()
})

test('set onmessage', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = new Ipc(port1, getData)
  const { resolve, promise } = Promises.withResolvers<MessageEvent>()
  ipc.onmessage = resolve
  port2.postMessage(1)
  const message = await promise
  expect(message.data).toBe(1)
  port1.close()
  port2.close()
})

test('send message - postMessage', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = new Ipc(port1, getData)
  const { resolve, promise } = Promises.withResolvers<MessageEvent>()
  port2.addEventListener('message', resolve)
  ipc.send(1)
  const message = await promise
  expect(message.data).toBe(1)
  port1.close()
  port2.close()
})

test('send message - send', async () => {
  const { port1, port2 } = new MessageChannel()
  const socket = {
    send(message: any) {
      port1.postMessage(message)
    },
  }
  const ipc = new Ipc(socket, getData)
  const { resolve, promise } = Promises.withResolvers<MessageEvent>()
  port2.addEventListener('message', resolve)
  ipc.send(1)
  const message = await promise
  expect(message.data).toBe(1)
  port1.close()
  port2.close()
})

test('send message - not supported', () => {
  const ipc = new Ipc({}, getData)
  expect(() => ipc.send(1)).toThrow(new Error('send not supported'))
})

test('sendAndTransfer message', async () => {
  const { port1, port2 } = new MessageChannel()
  const ipc = new Ipc(port1, getData)
  const { resolve, promise } = Promises.withResolvers<MessageEvent>()
  port2.addEventListener('message', resolve)
  const array = new Uint8Array([1])
  ipc.sendAndTransfer(array, [array.buffer])
  const message = await promise
  expect(message.data).toEqual(new Uint8Array([1]))
  port1.close()
  port2.close()
})

test('sendAndTransfer message - not supported', () => {
  const ipc = new Ipc({}, getData)
  expect(() => ipc.sendAndTransfer(1, [])).toThrow(new Error('sendAndTransfer not supported'))
})

test('dispose - close', () => {
  const port = {
    close: jest.fn(),
  }
  const ipc = new Ipc(port, getData)
  ipc.dispose()
  expect(port.close).toHaveBeenCalledTimes(1)
})

test('dispose - kill', () => {
  const process = {
    kill: jest.fn(),
  }
  const ipc = new Ipc(process, getData)
  ipc.dispose()
  expect(process.kill).toHaveBeenCalledTimes(1)
})
