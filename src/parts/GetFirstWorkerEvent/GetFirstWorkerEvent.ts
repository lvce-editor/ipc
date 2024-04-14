import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

export const getFirstWorkerEvent = (worker: any): any => {
  return GetFirstEvent.getFirstEvent(worker, {
    message: FirstWorkerEventType.Message,
    error: FirstWorkerEventType.Error,
  })
}
