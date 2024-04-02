import * as GetUtilityProcessPortData from '../GetUtilityProcessPortData/GetUtilityProcessPortData.ts'

export const listen = () => {
  // @ts-ignore
  const { parentPort } = process
  if (!parentPort) {
    throw new Error('parent port must be defined')
  }
  return parentPort
}

// @ts-ignore
export const signal = (parentPort) => {
  parentPort.postMessage('ready')
}

// @ts-ignore
export const wrap = (parentPort) => {
  return {
    parentPort,
    // @ts-ignore
    on(event, listener) {
      if (event === 'message') {
        // @ts-ignore
        const wrappedListener = (event) => {
          const actualData = GetUtilityProcessPortData.getUtilityProcessPortData(event)
          listener(actualData)
        }
        this.parentPort.on(event, wrappedListener)
      } else if (event === 'close') {
        this.parentPort.on('close', listener)
      } else {
        throw new Error('unsupported event type')
      }
    },
    // @ts-ignore
    off(event, listener) {
      this.parentPort.off(event, listener)
    },
    // @ts-ignore
    send(message) {
      this.parentPort.postMessage(message)
    },
    // @ts-ignore
    sendAndTransfer(message, transfer) {
      this.parentPort.postMessage(message, transfer)
    },
    dispose() {
      this.parentPort.close()
    },
  }
}
