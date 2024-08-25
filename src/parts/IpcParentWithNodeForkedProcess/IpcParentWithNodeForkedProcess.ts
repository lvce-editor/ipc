import type { ChildProcess } from 'node:child_process'
import * as Assert from '../Assert/Assert.ts'
import { ChildProcessError } from '../ChildProcessError/ChildProcessError.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as FixNodeParameters from '../FixNodeParameters/FixNodeParameters.ts'
import * as GetFirstNodeChildProcessEvent from '../GetFirstNodeChildProcessEvent/GetFirstNodeChildProcessEvent.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import { VError } from '../VError/VError.ts'

// @ts-ignore
export const create = async ({ path, argv = [], env, execArgv = [], stdio = 'inherit', name = 'child process' }) => {
  try {
    Assert.string(path)
    const actualArgv = ['--ipc-type=node-forked-process', ...argv]
    const { fork } = await import('node:child_process')
    const childProcess = fork(path, actualArgv, {
      env,
      execArgv,
      stdio: 'pipe',
    })
    const { type, event, stderr } = await GetFirstNodeChildProcessEvent.getFirstNodeChildProcessEvent(childProcess)
    if (type === FirstNodeWorkerEventType.Exit) {
      throw new ChildProcessError(stderr)
    }
    if (type === FirstNodeWorkerEventType.Error) {
      throw new Error(`child process had an error ${event}`)
    }
    if (stdio === 'inherit' && childProcess.stdout && childProcess.stderr) {
      childProcess.stdout.pipe(process.stdout)
      childProcess.stderr.pipe(process.stderr)
    }
    return childProcess
  } catch (error) {
    throw new VError(error, `Failed to launch ${name}`)
  }
}

class IpcParentWithNodeForkedProcess extends Ipc<ChildProcess> {
  readonly pid: number | undefined

  constructor(childProcess: ChildProcess) {
    super(childProcess)
    this.pid = childProcess.pid
  }

  override getData(message: any) {
    return message
  }

  override send(message: any): void {
    this._rawIpc.send(message)
  }

  override sendAndTransfer(message: any): void {
    const { newValue, transfer } = FixNodeParameters.fixNodeParameters(message)
    this._rawIpc.send(newValue, transfer)
  }

  override dispose(): void {
    this._rawIpc.kill()
  }

  override onClose(callback: any) {
    this._rawIpc.on('close', callback)
  }

  override onMessage(callback: any) {
    this._rawIpc.on('message', callback)
  }
}

export const wrap = (childProcess: ChildProcess) => {
  return new IpcParentWithNodeForkedProcess(childProcess)
}
