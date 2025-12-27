import type { Worker } from 'node:worker_threads'
import type { FirstEvent } from '../FirstEvent/FirstEvent.ts'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

export const getFirstNodeWorkerEvent = (worker: Worker): Promise<FirstEvent> => {
  return GetFirstEvent.getFirstEvent(worker, {
    error: FirstNodeWorkerEventType.Error,
    exit: FirstNodeWorkerEventType.Exit,
    message: FirstNodeWorkerEventType.Message,
  })
}
