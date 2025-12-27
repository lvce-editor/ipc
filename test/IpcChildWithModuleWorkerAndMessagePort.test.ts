import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/IpcChildWithModuleWorker/IpcChildWithModuleWorker.ts', () => {
  return {
    listen() {},
    signal: jest.fn(),
    wrap: jest.fn(),
  }
})

const IpcChildWithModuleWorkerAndMessagePort = await import(
  '../src/parts/IpcChildWithModuleWorkerAndMessagePort/IpcChildWithModuleWorkerAndMessagePort.ts'
)
const IpcChildWithModuleWorker = await import('../src/parts/IpcChildWithModuleWorker/IpcChildWithModuleWorker.ts')

test('listen - unexpected first message', async () => {
  const target = new EventTarget()
  // @ts-ignore
  jest.spyOn(IpcChildWithModuleWorker, 'wrap').mockImplementation(() => {
    return target
  })
  jest.spyOn(IpcChildWithModuleWorker, 'signal').mockImplementation(() => {
    setTimeout(() => {
      target.dispatchEvent(
        new MessageEvent('message', {
          data: {},
        }),
      )
    }, 0)
  })
  await expect(IpcChildWithModuleWorkerAndMessagePort.listen()).rejects.toThrow(new Error(`unexpected first message`))
})

test('listen - send back response', async () => {
  class Ipc extends EventTarget {
    send = jest.fn()
    dispose = jest.fn()
  }
  const target = new Ipc()
  // @ts-ignore
  jest.spyOn(IpcChildWithModuleWorker, 'wrap').mockImplementation(() => {
    return target
  })
  const port = {}
  jest.spyOn(IpcChildWithModuleWorker, 'signal').mockImplementation(() => {
    setTimeout(() => {
      target.dispatchEvent(
        new MessageEvent('message', {
          data: {
            id: 1,
            jsonrpc: '2.0',
            method: 'initialize',
            params: ['message-port', port],
          },
        }),
      )
    }, 0)
  })
  expect(await IpcChildWithModuleWorkerAndMessagePort.listen()).toBe(port)
  expect(target.dispose).toHaveBeenCalledTimes(1)
  expect(target.send).toHaveBeenCalledTimes(1)
  expect(target.send).toHaveBeenCalledWith({
    id: 1,
    jsonrpc: '2.0',
    result: null,
  })
})
