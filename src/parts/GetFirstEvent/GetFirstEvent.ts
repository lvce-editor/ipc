import * as Promises from '../Promises/Promises.ts'

// @ts-ignore
export const getFirstEvent = (eventEmitter, eventMap) => {
  const { resolve, promise } = Promises.withResolvers()
  const listenerMap = Object.create(null)
  // @ts-ignore
  const cleanup = (value) => {
    for (const event of Object.keys(eventMap)) {
      eventEmitter.off(event, listenerMap[event])
    }
    // @ts-ignore
    resolve(value)
  }
  for (const [event, type] of Object.entries(eventMap)) {
    // @ts-ignore
    const listener = (event) => {
      cleanup({
        type,
        event,
      })
    }
    eventEmitter.on(event, listener)
    listenerMap[event] = listener
  }
  return promise
}