interface Ipc {
  readonly send: (message: any) => void
  readonly sendAndTransfer: (message: any, transfer: any) => void
  readonly on: any
  readonly onmessage: any
  readonly dispose: () => void
  readonly isDisposed: () => void
}

interface IpcChild {
  readonly listen: any
  readonly wrap: Ipc
}

export const IpcChildWithElectronMessagePort: IpcChild
export const IpcChildWithElectronUtilityProcess: IpcChild
export const IpcChildWithNodeForkedProcess: IpcChild
export const IpcChildWithWebSocket: IpcChild
export const IpcChildWithNodeWorker: IpcChild

interface IpcParent {
  readonly create: any
  readonly wrap: Ipc
}

export const IpcParentWithElectronUtilityProcess: IpcParent
export const IpcParentWithNodeForkedProcess: IpcParent
export const IpcParentWithNodeWorker: IpcParent
