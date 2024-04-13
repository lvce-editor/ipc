import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'
import type { Worker } from 'node:worker_threads'

export const getFirstNodeWorkerEvent = (worker: Worker) => {
  return GetFirstEvent.getFirstEvent(worker, {
    message: FirstNodeWorkerEventType.Message,
    exit: FirstNodeWorkerEventType.Exit,
    error: FirstNodeWorkerEventType.Error,
  })
}
