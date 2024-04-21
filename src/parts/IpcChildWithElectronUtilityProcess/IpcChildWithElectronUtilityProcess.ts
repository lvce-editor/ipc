import * as GetUtilityProcessPortData from '../GetUtilityProcessPortData/GetUtilityProcessPortData.ts'
import { Ipc } from '../Ipc/Ipc.ts'
import * as ReadyMessage from '../ReadyMessage/ReadyMessage.ts'

export const listen = () => {
  // @ts-ignore
  const { parentPort } = process
  if (!parentPort) {
    throw new Error('parent port must be defined')
  }
  return parentPort
}

export const signal = (parentPort: any) => {
  parentPort.postMessage(ReadyMessage.readyMessage)
}

export const wrap = (parentPort: any) => {
  return new Ipc(parentPort, GetUtilityProcessPortData.getUtilityProcessPortData)
}
