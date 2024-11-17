import { expect, test } from '@jest/globals'
import * as IpcParentWithMessagePort from '../src/parts/IpcParentWithMessagePort/IpcParentWithMessagePort.ts'

test('send', async () => {
  const { port1, port2 } = new MessageChannel()
  const { resolve, promise } = Promise.withResolvers()
  port2.onmessage = resolve
  const ipc = IpcParentWithMessagePort.wrap(port1)
  ipc.send('test')
  const response = await promise
  // @ts-ignore
  expect(response.data).toBe('test')
  port1.close()
  port2.close()
})

test('receive', async () => {
  const { port1, port2 } = new MessageChannel()
  const { resolve, promise } = Promise.withResolvers()
  const ipc = IpcParentWithMessagePort.wrap(port1)
  ipc.addEventListener('message', resolve)
  port2.postMessage('test')
  const response = await promise
  // @ts-ignore
  expect(response.target).toBe(ipc)
  // @ts-ignore
  expect(response.data).toBe('test')
  port1.close()
  port2.close()
})
