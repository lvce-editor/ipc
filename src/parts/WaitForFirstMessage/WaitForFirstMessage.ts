export const waitForFirstMessage = async (port: EventTarget) => {
  const { promise, resolve } = Promise.withResolvers<Event>()
  port.addEventListener('message', resolve, { once: true })
  const event = await promise
  // @ts-ignore
  return event.data
}
