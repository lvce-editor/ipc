import type { Socket } from 'node:net'

type NativeSocket = Socket & { _handle: { readStop(): void; readStart(): void; reading: boolean } }
const childProcess = process as typeof process & { _send(message: { cmd?: string }, ...args: unknown[]): boolean }
const send = childProcess._send
childProcess._send = function (message, ...args) {
  if (message?.cmd === 'NODE_HANDLE_ACK') {
    setTimeout(() => send.call(this, message, ...args), 200)
    return true
  }
  return send.call(this, message, ...args)
}

process.on('message', (_message, handle) => {
  const socket = handle as NativeSocket
  socket.pause()
  socket._handle.readStop()
  socket._handle.reading = false
  socket.write('ready\n')
  // Let the peer send while the sender still owns a native handle and the
  // receiver is not reading, so a competing parent read cannot win by chance.
  setTimeout(() => {
    socket.on('data', (data) => socket.end(data))
    socket._handle.readStart()
    socket._handle.reading = true
    socket.resume()
  }, 100)
})
