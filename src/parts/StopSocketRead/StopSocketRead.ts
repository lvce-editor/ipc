import type { Socket } from 'node:net'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IsSocket from '../IsSocket/IsSocket.ts'

type NativeSocket = Socket & { _handle?: { readStop(): number; reading: boolean } | null }

export const stopSocketRead = (value: unknown): void => {
  if (!IsSocket.isSocket(value)) {
    return
  }
  const socket = value as NativeSocket
  socket.pause()
  const handle = socket._handle
  if (!handle) {
    return
  }
  // Node detaches the socket but keeps its native handle until the child ACK.
  // Stream pause alone leaves a competing read that can discard the first RPC.
  const status = handle.readStop()
  if (status !== 0) {
    socket.destroy()
    throw new IpcError(`Unable to stop socket reads before transfer (${status})`)
  }
  handle.reading = false
}
