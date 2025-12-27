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
      event: 1,
      stderr: '',
      type: FirstNodeWorkerEventType.Exit,
    }
  })
  await expect(IpcParentWithNodeForkedProcess.create({ argv: [], env: {}, execArgv: [], path: '/test/childProcess.js' })).rejects.toThrow(
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
      event: ReadyMessage.readyMessage,
      type: FirstNodeWorkerEventType.Message,
    }
  })
  const childProcess = await IpcParentWithNodeForkedProcess.create({ argv: [], env: {}, execArgv: [], path: '/test/childProcess.js' })
  expect(childProcess).toBeDefined()
})
