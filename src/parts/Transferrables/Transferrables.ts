import * as IsMessagePort from '../IsMessagePort/IsMessagePort.ts'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.ts'
import * as IsOffscreenCanvas from '../IsOffscreenCanvas/IsOffscreenCanvas.ts'
import * as IsSocket from '../IsSocket/IsSocket.ts'

export const transferrables = [
  IsMessagePort.isMessagePort,
  IsMessagePortMain.isMessagePortMain,
  IsOffscreenCanvas.isOffscreenCanvas,
  IsSocket.isSocket,
]
