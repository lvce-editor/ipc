import type { IIpc } from '../IIpc/Iipc.ts'

export const attachEvents = (that: IIpc): void => {
  const handleMessage = (...args: any[]): void => {
    const data = that.getData(...args)
    that.dispatchEvent(
      new MessageEvent('message', {
        data,
      }),
    )
  }
  that.onMessage(handleMessage)
  const handleClose = (event: any): void => {
    that.dispatchEvent(new Event('close'))
  }
  that.onClose(handleClose)
}
