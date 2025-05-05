import { expect, test } from '@jest/globals'
import { EventEmitter } from 'node:events'
import type { NodeJsProcess } from '../src/parts/NodeJsProcess/NodeJsProcess.ts'
import * as IpcChildWithNodeForkedProcess from '../src/parts/IpcChildWithNodeForkedProcess/IpcChildWithNodeForkedProcess.ts'

class MockProcess extends EventEmitter implements NodeJsProcess {
  send() {
    return true
  }
}

test('data event', async () => {
  const process = new MockProcess()
  const ipc = IpcChildWithNodeForkedProcess.wrap(process)
  const { resolve, promise } = Promise.withResolvers<MessageEvent>()
  ipc.addEventListener('message', resolve)
  const handle = {
    isSocket: true,
  }
  const message = {
    jsonrpc: '2.0',
    method: 'handleSocket',
    params: [],
  }
  process.emit('message', message, handle)
  const response = await promise
  expect(response.data).toEqual({
    jsonrpc: '2.0',
    method: 'handleSocket',
    params: [
      {
        isSocket: true,
      },
    ],
  })
})
