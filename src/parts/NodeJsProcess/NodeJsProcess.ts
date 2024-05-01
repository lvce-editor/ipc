import type { EventEmitter } from 'node:events'

export interface NodeJsProcess extends EventEmitter {
  readonly send: (message: any, sendHandle?: any) => boolean
}
