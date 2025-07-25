import { beforeEach, expect, jest, test } from '@jest/globals'
import * as IpcChildWithNodeWorker from '../src/parts/IpcChildWithNodeWorker/IpcChildWithNodeWorker.ts'
import { IpcError } from '../src/parts/IpcError/IpcError.js'
import * as ReadyMessage from '../src/parts/ReadyMessage/ReadyMessage.ts'

const mockParentPort = jest.fn()

beforeEach(() => {
  jest.resetModules()
})

jest.unstable_mockModule('node:worker_threads', () => {
  return {
    get parentPort() {
      return mockParentPort()
    },
  }
})

test('listen - missing parentPort', async () => {
  mockParentPort.mockReturnValue(null)
  await expect(IpcChildWithNodeWorker.listen()).rejects.toThrow(new IpcError('parentPort is required for node worker threads ipc'))
})

test('listen - return parentPort', async () => {
  const messagePort = {}
  mockParentPort.mockReturnValue(messagePort)
  expect(await IpcChildWithNodeWorker.listen()).toBe(messagePort)
})

test('signal - send ready message', async () => {
  const messagePort = {
    postMessage: jest.fn(),
  } as any
  IpcChildWithNodeWorker.signal(messagePort)
  expect(messagePort.postMessage).toHaveBeenCalledTimes(1)
  expect(messagePort.postMessage).toHaveBeenCalledWith(ReadyMessage.readyMessage)
})
