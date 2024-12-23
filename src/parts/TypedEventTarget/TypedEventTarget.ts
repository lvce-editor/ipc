// internal helper type
interface IntermediateEventTarget<EventMap> extends EventTarget {
  addEventListener<K extends keyof EventMap>(type: K, callback: (event: EventMap[K]) => void, options?: boolean | AddEventListenerOptions): void

  addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void
}

export type TypedEventTarget<EventMap extends object> = { new (): IntermediateEventTarget<EventMap> }
