import { expect, test } from '@jest/globals'
import * as FixElectronParameters from '../src/parts/FixElectronParameters/FixElectronParameters.ts'

test('move messageport from params to transfer list', () => {
  const { port1 } = new MessageChannel()
  const value = {
    jsonrpc: '2.0',
    method: 'CreateMessagePort.createMessagePort',
    params: [1, port1],
  }
  const { newValue, transfer } = FixElectronParameters.fixElectronParameters(value)
  expect(newValue).toEqual({
    jsonrpc: '2.0',
    method: 'CreateMessagePort.createMessagePort',
    params: [1],
  })
  expect(transfer).toEqual([port1])
})

test('null', () => {
  const value = null
  const { newValue, transfer } = FixElectronParameters.fixElectronParameters(value)
  expect(newValue).toBe(null)
  expect(transfer).toEqual([])
})
