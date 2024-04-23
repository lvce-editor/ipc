import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.ts'
import * as GetFirstWorkerEvent from '../GetFirstWorkerEvent/GetFirstWorkerEvent.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IsErrorEvent from '../IsErrorEvent/IsErrorEvent.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'
import * as TryToGetActualWorkerErrorMessage from '../TryToGetActualWorkerErrorMessage/TryToGetActualWorkerErrorMessage.ts'
import { WorkerError } from '../WorkerError/WorkerError.ts'
import * as WorkerType from '../WorkerType/WorkerType.ts'

export const create = async ({ url, name }: { url: string; name: string }) => {
  const worker = new Worker(url, {
    type: WorkerType.Module,
    name,
  })
  const { type, event } = await GetFirstWorkerEvent.getFirstWorkerEvent(worker)
  switch (type) {
    case FirstWorkerEventType.Message:
      if (event.data !== ReadyMessage.readyMessage) {
        throw new IpcError('unexpected first message from worker')
      }
      break
    case FirstWorkerEventType.Error:
      if (IsErrorEvent.isErrorEvent(event)) {
        throw new WorkerError(event)
      }
      const actualErrorMessage = await TryToGetActualWorkerErrorMessage.tryToGetActualErrorMessage({
        name,
      })
      throw new Error(actualErrorMessage)
    default:
      break
  }
  return worker
}

const getData = (event: any) => {
  // TODO why are some events not instance of message event?
  if (event instanceof MessageEvent) {
    return event.data
  }
  return event
}

class IpcParentWithModuleWorker extends Ipc<Worker> {
  override getData(event: any) {
    return getData(event)
  }

  override send(message: any): void {
    this._rawIpc.postMessage(message)
  }

  override sendAndTransfer(message: any, transfer: any): void {
    this._rawIpc.postMessage(message, transfer)
  }

  override dispose(): void {
    // ignore
  }

  override onClose(callback: any) {
    // ignore
  }

  override onMessage(callback: any) {
    this._rawIpc.addEventListener('message', callback)
  }
}

export const wrap = (worker: any) => {
  return new IpcParentWithModuleWorker(worker)
}
