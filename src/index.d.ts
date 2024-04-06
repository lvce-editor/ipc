interface IpcChild {
  readonly listen: any
  readonly wrap: any
}

export const IpcChildWithElectronMessagePort: IpcChild
export const IpcChildWithElectronUtilityProcess: IpcChild
export const IpcChildWithNodeForkedProcess: IpcChild
export const IpcChildWithWebSocket: IpcChild
export const IpcChildWithModuleWorkerAndMessagePort: IpcChild
export const IpcChildWithModuleWorker: IpcChild

interface IpcParent {
  readonly create: any
  readonly wrap: any
}

export const IpcParentWithElectronUtilityProcess: IpcParent
export const IpcParentWithNodeForkedProcess: IpcParent
export const IpcParentWithNodeWorker: IpcParent
