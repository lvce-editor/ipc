import { expect, test } from '@jest/globals'
import * as GetFirstEvent from '../src/parts/GetFirstEvent/GetFirstEvent.js'
import { EventEmitter } from 'node:events'

test('getFirstEvent', async () => {
  const emitter = new EventEmitter()
  const promise = GetFirstEvent.getFirstEvent(emitter, {
    a: 1,
  })
  emitter.emit('a', 1)
  expect(await promise).toEqual({
    event: 1,
    type: 1,
  })
})
