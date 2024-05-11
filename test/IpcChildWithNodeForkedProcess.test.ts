import { expect, test } from '@jest/globals'
import { EventEmitter } from 'node:events'
import * as IpcChildWithNodeForkedProcess from '../src/parts/IpcChildWithNodeForkedProcess/IpcChildWithNodeForkedProcess.ts'
import type { NodeJsProcess } from '../src/parts/NodeJsProcess/NodeJsProcess.ts'
import * as Promises from '../src/parts/Promises/Promises.ts'


class MockProcess extends EventEmitter implements NodeJsProcess {
  constructor() {
    super()
  }

  send() {
    return true
  }
}


test('data event', async () => {
  const process = new MockProcess()
  const ipc = IpcChildWithNodeForkedProcess.wrap(process)
  const { resolve, promise } = Promises.withResolvers<MessageEvent>()
  ipc.addEventListener('message', resolve)
  const message = {
    jsonrpc: '2.0',
    method: 'handleSocket',
    params: []
  }
  const handle = {
    isSocket: true
  }
  process.emit('message', message, handle)
  const response = await promise
  console.log({ response })
  expect(response.data).toEqual({
    jsonrpc: '2.0',
    method: 'handleSocket',
    params: [{
      isSocket: true
    }]
  })
})
