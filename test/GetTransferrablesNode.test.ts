import { expect, test } from '@jest/globals'
import * as GetTransferrablesNode from '../src/parts/GetTransferrablesNode/GetTransferrablesNode.js'

test('socket inside object', () => {
  class Socket {}
  const socket = new Socket()
  const message = {
    jsonrpc: '2.0',
    method: 'HandleWebSocket.handleWebSocket',
    params: [socket],
    id: 1,
  }
  expect(GetTransferrablesNode.getTransferrablesNode(message)).toBe(socket)
})
