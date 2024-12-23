import { expect, test } from '@jest/globals'
import * as GetTransferrablesNode from '../src/parts/GetTransferrablesNode/GetTransferrablesNode.js'

test('socket inside object', () => {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
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

test('no transferrables', () => {
  const value: any[] = []
  expect(() => GetTransferrablesNode.getTransferrablesNode(value)).toThrow(new Error('no transferrables found'))
})
