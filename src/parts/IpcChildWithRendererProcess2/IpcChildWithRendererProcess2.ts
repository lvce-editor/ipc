import type { IpcMainEvent, WebContents } from 'electron'
import { Ipc } from '../Ipc/Ipc.ts'

const preloadChannelType = 'port'

export const listen = ({ webContents }: { webContents: WebContents }) => {
  return webContents
}

const getData = (event: IpcMainEvent, message: any) => {
  const { ports } = event
  const data = {
    ...message,
    params: [...message.params, ...ports],
  }
  return data
}

class IpcChildWithRendererProcess2 extends Ipc<WebContents> {
  override getData(event: any, message: any) {
    return getData(event, message)
  }

  override send(message: any) {
    this._rawIpc.postMessage(preloadChannelType, message)
  }

  override sendAndTransfer(message: any, transfer: any): void {
    this._rawIpc.postMessage(preloadChannelType, message, transfer)
  }

  override dispose(): void {
    // ignore
  }

  override onMessage(callback: any) {
    this._rawIpc.ipc.on(preloadChannelType, callback)
  }

  override onClose(callback: any) {
    this._rawIpc.on('destroyed', callback)
  }
}

export const wrap = (webContents: WebContents) => {
  return new IpcChildWithRendererProcess2(webContents)
}
