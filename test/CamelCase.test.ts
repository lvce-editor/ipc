import { expect, test } from '@jest/globals'
import * as CamelCase from '../src/parts/CamelCase/CamelCase.js'

test('empty string', async () => {
  const string = ''
  expect(CamelCase.camelCase(string)).toBe('')
})

test('single letter', async () => {
  const string = 'a'
  expect(CamelCase.camelCase(string)).toBe('a')
})
