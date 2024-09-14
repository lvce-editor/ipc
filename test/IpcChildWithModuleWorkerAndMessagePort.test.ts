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
  const port = {}
  jest.spyOn(IpcChildWithModuleWorker, 'signal').mockImplementation(() => {
    setTimeout(() => {
      // @ts-ignore
      IpcChildWithModuleWorker.target.dispatchEvent(
        new MessageEvent('message', {
          data: {
            jsonrpc: '2.0',
            method: 'initialize',
            id: 1,
            params: ['message-port', port],
          },
        }),
      )
    }, 0)
  })
  const send = jest.fn()
  const dispose = jest.fn()
  // @ts-ignore
  jest.spyOn(IpcChildWithModuleWorker, 'wrap').mockImplementation(() => {
    return {
      send,
      dispose,
    }
  })
  expect(await IpcChildWithModuleWorkerAndMessagePort.listen()).toBe(port)
})
