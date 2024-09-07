import { expect, test } from '@jest/globals'
import * as FixNodeParameters from '../src/parts/FixNodeParameters/FixNodeParameters.ts'

test('error - no transferrables found', () => {
  const value = {
    jsonrpc: '2.0',
    method: 'CreateMessagePort.createMessagePort',
    params: [],
  }
  expect(() => FixNodeParameters.fixNodeParameters(value)).toThrow(new Error('no transferrables found'))
})

test('transfer messagePort', () => {
  const { port1 } = new MessageChannel()
  const value = {
    jsonrpc: '2.0',
    method: 'CreateMessagePort.createMessagePort',
    params: [, port1],
  }
  const { newValue, transfer } = FixNodeParameters.fixNodeParameters(value)
  expect(newValue).toEqual({
    jsonrpc: '2.0',
    method: 'CreateMessagePort.createMessagePort',
    params: [],
  })
  expect(transfer).toBe(port1)
})