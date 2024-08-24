export const isTransferrable = (value: unknown) => {
  return value instanceof MessagePort
}
