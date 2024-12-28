interface Ipc extends EventTarget {
  readonly send: (message: any) => void
  readonly sendAndTransfer: (message: any, transfer: any) => void
  readonly dispose: () => void
  readonly isDisposed: () => void
}

interface IpcChild {
  readonly listen: any
  readonly wrap: (rawIpc: any) => Ipc
}

export const IpcChildWithElectronMessagePort: IpcChild
export const IpcChildWithElectronUtilityProcess: IpcChild
export const IpcChildWithNodeForkedProcess: IpcChild
export const IpcChildWithWebSocket: IpcChild
export const IpcChildWithNodeWorker: IpcChild
export const IpcChildWithRendererProcess2: IpcChild
export const IpcChildWithModuleWorkerAndMessagePort: IpcChild
export const IpcChildWithModuleWorker: IpcChild
export const IpcChildWithMessagePort: IpcChild
export const IpcChildWithElectronWindow: IpcChild

interface IpcParent {
  readonly create: any
  readonly wrap: (rawIpc: any) => Ipc
}

export const IpcParentWithElectronUtilityProcess: IpcParent
export const IpcParentWithNodeForkedProcess: IpcParent
export const IpcParentWithNodeWorker: IpcParent
export const IpcParentWithElectronMessagePort: IpcParent
export const IpcParentWithMessagePort: IpcParent
export const IpcParentWithWebSocket: IpcParent
export const IpcParentWithModuleWorker: IpcParent
export const IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug: IpcParent
