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

interface IpcParent<WrapOptions = any, CreateOptions = any> {
  readonly create: (options: CreateOptions) => Promise<WrapOptions>
  readonly wrap: (rawIpc: WrapOptions) => Ipc<WrapOptions>
}

interface IpcChildWithMessagePortListenOptions {
  readonly port: MessagePort
}

// MessagePort specific implementations
export const IpcChildWithMessagePort: IpcChild<MessagePort, IpcChildWithMessagePortListenOptions>

interface IpcParentWithMessagePortCreateOptions {
  readonly messagePort: MessagePort
  readonly isMessagePortOpen?: boolean
}

export const IpcParentWithMessagePort: IpcParent<MessagePort, IpcParentWithMessagePortCreateOptions>

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

interface IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBugCreateOptions {
  readonly sendPort: ({ port, url, name }: { port: MessagePort; url: string; name: string }) => Promise<void>
  readonly url: string
  readonly name: string
}

export const IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug: IpcParent<
  MessagePort,
  IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBugCreateOptions
>
