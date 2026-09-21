import { expect, test } from '@jest/globals'
import { fork } from 'node:child_process'
import { once } from 'node:events'
import { createConnection, createServer } from 'node:net'
import * as IpcParentWithNodeForkedProcess from '../src/parts/IpcParentWithNodeForkedProcess/IpcParentWithNodeForkedProcess.ts'

test('preserves the first request until the child acknowledges the socket transfer', async () => {
  const child = fork(new URL('fixtures/socketTransferChild.ts', import.meta.url))
  const ipc = IpcParentWithNodeForkedProcess.wrap(child)
  const server = createServer((socket) => ipc.sendAndTransfer({ method: 'socket', params: [socket] }))
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Expected TCP server address')
  const client = createConnection(address.port, '127.0.0.1')
  try {
    const [ready] = await once(client, 'data')
    expect(ready.toString()).toBe('ready\n')
    const response = once(client, 'data', { signal: AbortSignal.timeout(3000) })
    client.write('first request')
    const [data] = await response
    expect(data.toString()).toBe('first request')
  } finally {
    client.destroy()
    child.kill()
    server.close()
  }
}, 10_000)
