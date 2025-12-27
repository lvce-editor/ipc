export interface IIpc extends EventTarget {
  readonly getData: (...args: any[]) => any
  readonly onClose: (callback: any) => void
  readonly onMessage: (callback: any) => void
}
