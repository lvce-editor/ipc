import { expect, test } from '@jest/globals'
import * as Promises from '../src/parts/Promises/Promises.js'

test('withResolvers', async () => {
  const value = {}
  const { resolve, promise } = Promises.withResolvers()
  // @ts-ignore
  resolve(value)
  expect(await promise).toBe(value)
})
