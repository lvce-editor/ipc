import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

// @ts-ignore
export const getFirstNodeWorkerEvent = (worker) => {
  return GetFirstEvent.getFirstEvent(worker, {
    exit: FirstNodeWorkerEventType.Exit,
    error: FirstNodeWorkerEventType.Error,
  })
}