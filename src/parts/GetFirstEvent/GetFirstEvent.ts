import type { EventEmitter } from 'node:events'
import type { FirstEvent } from '../FirstEvent/FirstEvent.ts'
import * as Promises from '../Promises/Promises.ts'

const addListener = (emitter: EventEmitter | EventTarget, type: string, callback: any) => {
  if ('addEventListener' in emitter) {
    emitter.addEventListener(type, callback)
  } else {
    emitter.on(type, callback)
  }
}

const removeListener = (emitter: EventEmitter | EventTarget, type: string, callback: any) => {
  if ('removeEventListener' in emitter) {
    emitter.removeEventListener(type, callback)
  } else {
    emitter.off(type, callback)
  }
}

export const getFirstEvent = (eventEmitter: EventEmitter | EventTarget, eventMap: any): Promise<FirstEvent> => {
  const { resolve, promise } = Promises.withResolvers<FirstEvent>()
  const listenerMap = Object.create(null)
  const cleanup = (value: any) => {
    for (const event of Object.keys(eventMap)) {
      removeListener(eventEmitter, event, listenerMap[event])
    }
    resolve(value)
  }
  for (const [event, type] of Object.entries(eventMap)) {
    const listener = (event: any) => {
      cleanup({
        type,
        event,
      })
    }
    addListener(eventEmitter, event, listener)
    listenerMap[event] = listener
  }
  return promise
}
