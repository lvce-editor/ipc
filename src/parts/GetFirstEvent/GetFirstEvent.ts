import * as Promises from '../Promises/Promises.ts'
import { EventEmitter } from 'node:events'

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

export const getFirstEvent = (eventEmitter: EventEmitter | EventTarget, eventMap: any) => {
  const { resolve, promise } = Promises.withResolvers()
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
