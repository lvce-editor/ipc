import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.ts'
import * as GetFirstWorkerEvent from '../GetFirstWorkerEvent/GetFirstWorkerEvent.ts'
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

export const wrap = (worker: any) => {
  let handleMessage: any
  return {
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event: any) => {
          const data = getData(event)
          listener({ data, target: this })
        }
      } else {
        handleMessage = null
      }
      worker.onmessage = handleMessage
    },
    send(message: any) {
      worker.postMessage(message)
    },
    sendAndTransfer(message: any, transfer: any) {
      worker.postMessage(message, transfer)
    },
  }
}
