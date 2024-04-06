import * as Promises from '../Promises/Promises.ts'

export const waitForFirstMessage = async (port: any) => {
  const { resolve, promise } = Promises.withResolvers()
  const cleanup = (value: any) => {
    port.onmessage = null
    resolve(value)
  }
  const handleMessage = (event: any) => {
    cleanup(event)
  }
  port.onmessage = handleMessage
  const event = await promise
  // @ts-expect-error
  return event.data
}
