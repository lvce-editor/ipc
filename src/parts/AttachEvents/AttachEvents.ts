import type { IIpc } from '../IIpc/Iipc.ts'

export const attachEvents = (that: IIpc) => {
  const handleMessage = (...args: any[]) => {
    const data = that.getData(...args)
    that.dispatchEvent(
      new MessageEvent('message', {
        data,
      }),
    )
  }
  that.onMessage(handleMessage)
  const handleClose = (event: any) => {
    that.dispatchEvent(new Event('close'))
  }
  that.onClose(handleClose)
}
