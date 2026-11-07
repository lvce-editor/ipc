import type { ChildProcess } from 'node:child_process'
import { expect, jest, test } from '@jest/globals'
import { EventEmitter } from 'node:events'
import * as IpcParentWithNodeForkedProcess from '../src/parts/IpcParentWithNodeForkedProcess/IpcParentWithNodeForkedProcess.ts'

const createChild = () => Object.assign(new EventEmitter(), { connected: true, send: jest.fn() })

test('invalidates the cached endpoint on disconnect before stdio close and removes listeners', () => {
  const child = createChild()
  const ipc = IpcParentWithNodeForkedProcess.wrap(child as unknown as ChildProcess)
  const close = jest.fn()
  ipc.addEventListener('close', close)
  child.connected = false
  child.emit('disconnect')
  expect(close).toHaveBeenCalledTimes(1)
  child.emit('close')
  expect(close).toHaveBeenCalledTimes(1)
  expect(child.listenerCount('disconnect')).toBe(0)
  expect(child.listenerCount('close')).toBe(0)
})

test('a disconnected channel fails synchronously instead of emitting an unhandled child-process error', () => {
  const child = createChild()
  const ipc = IpcParentWithNodeForkedProcess.wrap(child as unknown as ChildProcess)
  child.connected = false
  expect(() => ipc.send({ method: 'test', params: [] })).toThrow('IPC channel is closed')
  expect(() => ipc.sendAndTransfer({ method: 'test', params: [] })).toThrow('IPC channel is closed')
  expect(child.send).not.toHaveBeenCalled()
})
