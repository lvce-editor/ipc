export const isMessagePort = (value: unknown) => {
  return value && value instanceof MessagePort
}
