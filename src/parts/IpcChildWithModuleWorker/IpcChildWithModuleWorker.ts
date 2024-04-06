import * as GetData from '../GetData/GetData.ts'

export const listen = () => {
  // @ts-ignore
  if (typeof WorkerGlobalScope === 'undefined') {
    throw new TypeError('module is not in web worker scope')
  }
  // @ts-ignore
  globalThis.postMessage('ready')
  return globalThis
}

export const signal = (global: any) => {
  global.postMessage('ready')
}

export const wrap = (global: any) => {
  return {
    global,
    /**
     * @type {any}
     */
    listener: undefined,
    send(message: any) {
      this.global.postMessage(message)
    },
    sendAndTransfer(message: any, transferables: any) {
      this.global.postMessage(message, transferables)
    },
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      const wrappedListener = (event: any) => {
        const data = GetData.getData(event)
        // @ts-expect-error
        listener({
          data,
          target: this,
        })
      }
      this.listener = listener
      this.global.onmessage = wrappedListener
    },
  }
}
