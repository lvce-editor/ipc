import { jest, test, expect } from '@jest/globals'
import * as FirstNodeWorkerEventType from '../src/parts/FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import * as ReadyMessage from '../src/parts/ReadyMessage/ReadyMessage.js'

jest.unstable_mockModule('../src/parts/GetFirstNodeChildProcessEvent/GetFirstNodeChildProcessEvent.js', () => {
  return {
    getFirstNodeChildProcessEvent: jest.fn(),
  }
})

jest.unstable_mockModule('node:child_process', () => {
  return {
    fork: jest.fn(),
  }
})

const GetFirstNodeChildProcessEvent = await import('../src/parts/GetFirstNodeChildProcessEvent/GetFirstNodeChildProcessEvent.js')
const IpcParentWithNodeForkedProcess = await import('../src/parts/IpcParentWithNodeForkedProcess/IpcParentWithNodeForkedProcess.js')
const NodeChildProcess = await import('node:child_process')

test.skip('create - error - child process exits with code 1', async () => {
  // @ts-ignore
  NodeChildProcess.fork.mockImplementation(() => {
    return {}
  })
  // @ts-ignore
  GetFirstNodeChildProcessEvent.getFirstNodeChildProcessEvent.mockImplementation(() => {
    return {
      type: FirstNodeWorkerEventType.Exit,
      event: 1,
      stderr: '',
    }
  })
  await expect(IpcParentWithNodeForkedProcess.create({ path: '/test/childProcess.js', argv: [], env: {}, execArgv: [] })).rejects.toThrow(
    new Error(`Failed to launch child process: ChildProcessError: child process error`),
  )
})

test('create', async () => {
  // @ts-ignore
  NodeChildProcess.fork.mockImplementation(() => {
    return {}
  })
  // @ts-ignore
  GetFirstNodeChildProcessEvent.getFirstNodeChildProcessEvent.mockImplementation(() => {
    return {
      type: FirstNodeWorkerEventType.Message,
      event: ReadyMessage.readyMessage,
    }
  })
  const childProcess = await IpcParentWithNodeForkedProcess.create({ path: '/test/childProcess.js', argv: [], env: {}, execArgv: [] })
  expect(childProcess).toBeDefined()
})
