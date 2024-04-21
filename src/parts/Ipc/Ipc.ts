import { TypedEventTarget } from '../TypedEventTarget/TypedEventTarget.ts'

const attachEvent = (rawIpc: any, getData: any, that: any) => {
  const wrapped = (event: any) => {
    const data = getData(event)
    that.dispatchEvent(
      new MessageEvent('message', {
        data,
      }),
    )
  }
  if ('onmessage' in rawIpc) {
    rawIpc.onmessage = wrapped
  } else if ('on' in rawIpc) {
    rawIpc.on('message', wrapped)
  }
}

export abstract class Ipc<T> extends (EventTarget as TypedEventTarget<{
  message: MessageEvent
}>) {
  readonly _rawIpc: T

  constructor(rawIpc: T) {
    super()
    attachEvent(rawIpc, this.getData, this)
    this._rawIpc = rawIpc
  }

  abstract getData(event: any): any

  abstract send(message: any): void

  abstract sendAndTransfer(message: any, transfer: any): void

  abstract dispose(): void
}
