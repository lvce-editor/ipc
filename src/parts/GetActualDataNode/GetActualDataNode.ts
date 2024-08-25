export const getActualData = (message: any, handle: any) => {
  if (handle) {
    return {
      ...message,
      params: [handle, ...message.params],
    }
  }
  return message
}
