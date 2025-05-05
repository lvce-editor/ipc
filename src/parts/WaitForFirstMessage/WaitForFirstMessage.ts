export const waitForFirstMessage = async (port: EventTarget) => {
  const { resolve, promise } = Promise.withResolvers<Event>()
  port.addEventListener('message', resolve, { once: true })
  const event = await promise
  // @ts-ignore
  return event.data
}
