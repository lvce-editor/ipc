import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

export const getFirstWorkerEvent = (worker: any): any => {
  return GetFirstEvent.getFirstEvent(worker, {
    error: FirstWorkerEventType.Error,
    message: FirstWorkerEventType.Message,
  })
}
