import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = () => {
  // @ts-ignore
  return window
}

export const signal = (global: any) => {
  global.postMessage(ReadyMessage.readyMessage)
}

export const wrap = (window: any) => {
  return {
    window,
    /**
     * @type {any}
     */
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      this.listener = listener
      const wrappedListener = (event: any) => {
        const data = event.data
        if ('method' in data) {
          return
        }
        // @ts-ignore
        listener({ data, target: this })
      }
      this.window.onmessage = wrappedListener
    },
    send(message: any) {
      this.window.postMessage(message)
    },
    sendAndTransfer(message: any, transfer: any) {
      this.window.postMessage(message, '*', transfer)
    },
    dispose() {
      this.window.onmessage = null
      this.window = undefined
      this.listener = undefined
    },
  }
}
