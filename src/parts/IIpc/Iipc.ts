export interface IIpc extends EventTarget {
  readonly onMessage: (callback: any) => void
  readonly onClose: (callback: any) => void
  readonly getData: (...args: any[]) => any
}
