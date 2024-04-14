import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = async () => {
  if (!process.send) {
    throw new Error('process.send must be defined')
  }
  return process
}

// @ts-ignore
export const signal = (process) => {
  process.send(ReadyMessage.readyMessage)
}

// @ts-ignore
const getActualData = (message, handle) => {
  if (handle) {
    return {
      ...message,
      params: [...message.params, handle],
    }
  }
  return message
}

// @ts-ignore
export const wrap = (process) => {
  return {
    process,
    // @ts-ignore
    on(event, listener) {
      if (event === 'message') {
        // @ts-ignore
        const wrappedListener = (event, handle) => {
          const actualData = getActualData(event, handle)
          listener(actualData)
        }
        this.process.on(event, wrappedListener)
      } else if (event === 'close') {
        this.process.on('close', listener)
      } else {
        throw new Error('unsupported event type')
      }
    },
    // @ts-ignore
    off(event, listener) {
      this.process.off(event, listener)
    },
    // @ts-ignore
    send(message) {
      this.process.send(message)
    },
    dispose() {},
  }
}
