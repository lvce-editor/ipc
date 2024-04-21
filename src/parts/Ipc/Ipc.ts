import { TypedEventTarget } from '../TypedEventTarget/TypedEventTarget.ts'

const attachEvent = (rawIpc: any, getData: any, that: any) => {
  if ('onmessage' in rawIpc) {
    const wrapped = (event: any) => {
      const data = getData(event)
      that.dispatchEvent(
        new MessageEvent('message', {
          data,
        }),
      )
    }
    rawIpc.onmessage = wrapped
  }
}

export class Ipc extends (EventTarget as TypedEventTarget<{
  message: MessageEvent
}>) {
  _rawIpc: any
  constructor(rawIpc: any, getData: any) {
    super()
    attachEvent(rawIpc, getData, this)
    this._rawIpc = rawIpc
  }

  /**
   * @deprecated use addEventListener instead of getter/setter
   */
  set onmessage(listener: (value: MessageEvent<any>) => void) {
    this.addEventListener('message', listener)
  }

  send(message: any) {
    if ('postMessage' in this._rawIpc) {
      this._rawIpc.postMessage(message)
      return
    }
    throw new Error('send not supported')
  }

  sendAndTransfer(message: any, transfer: any) {
    if ('postMessage' in this._rawIpc) {
      this._rawIpc.postMessage(message, transfer)
      return
    }
    throw new Error('sendAndTransfer not supported')
  }

  dispose() {
    if ('close' in this._rawIpc) {
      this._rawIpc.close()
    }
  }
}
