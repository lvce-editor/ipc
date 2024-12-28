interface Ipc<T = any> extends EventTarget {
  readonly send: (message: any) => void
  readonly sendAndTransfer: (message: any, transfer: any) => void
  readonly dispose: () => void | Promise<void>
  readonly isDisposed: () => boolean
}

interface IpcChild<WrapOptions = any, ListenOptions = any> {
  readonly listen: (listenOptions: ListenOptions) => Promise<WrapOptions> | WrapOptions
  readonly wrap: (rawIpc: WrapOptions) => Ipc<WrapOptions>
}

interface IpcParent<T = any> {
  readonly create: (options: any) => Promise<T>
  readonly wrap: (rawIpc: T) => Ipc<T>
}

interface IpcChildWithMessagePortListenOptions {
  readonly port: MessagePort
}

// MessagePort specific implementations
export const IpcChildWithMessagePort: IpcChild<MessagePort, IpcChildWithMessagePortListenOptions>
export const IpcParentWithMessagePort: IpcParent<MessagePort>

interface IpcChildWithElectronMessagePortListenOptions {
  readonly messagePort: import('electron').MessagePortMain
}

interface IpcChildWithElectronUtilityProcessListenOptions {}

interface IpcChildWithElectronWindowListenOptions {}

// Electron specific implementations
export const IpcChildWithElectronMessagePort: IpcChild<import('electron').MessagePortMain, IpcChildWithElectronMessagePortListenOptions>
export const IpcChildWithElectronUtilityProcess: IpcChild<import('electron').MessagePortMain, IpcChildWithElectronUtilityProcessListenOptions>
export const IpcChildWithElectronWindow: IpcChild<Window, IpcChildWithElectronWindowListenOptions>

// Node specific implementations
export const IpcChildWithNodeWorker: IpcChild<import('worker_threads').MessagePort>
export const IpcChildWithNodeForkedProcess: IpcChild<import('child_process').ChildProcess>
export const IpcChildWithWebSocket: IpcChild<WebSocket>

// Web specific implementations
export const IpcChildWithModuleWorker: IpcChild<Worker>
export const IpcChildWithModuleWorkerAndMessagePort: IpcChild<MessagePort>
export const IpcChildWithRendererProcess2: IpcChild<MessagePort>

// Parent implementations
export const IpcParentWithElectronUtilityProcess: IpcParent<import('electron').MessagePortMain>
export const IpcParentWithNodeForkedProcess: IpcParent<import('child_process').ChildProcess>
export const IpcParentWithNodeWorker: IpcParent<import('worker_threads').Worker>
export const IpcParentWithElectronMessagePort: IpcParent<Electron.MessagePortMain>
export const IpcParentWithWebSocket: IpcParent<WebSocket>
export const IpcParentWithModuleWorker: IpcParent<Worker>
export const IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug: IpcParent<Worker>
