import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import type { IIpc } from '../IIpc/Iipc.ts'
import type { TypedEventTarget } from '../TypedEventTarget/TypedEventTarget.ts'

export abstract class Ipc<T>
  extends (EventTarget as TypedEventTarget<{
    message: MessageEvent
  }>)
  implements IIpc
{
  readonly _rawIpc: T

  constructor(rawIpc: T) {
    super()
    this._rawIpc = rawIpc
    AttachEvents.attachEvents(this)
  }

  abstract getData(...args: any[]): any

  abstract onClose(callback: any): any

  abstract onMessage(callback: any): any

  abstract send(message: any): void

  abstract sendAndTransfer(message: any): void

  abstract dispose(): void
}
