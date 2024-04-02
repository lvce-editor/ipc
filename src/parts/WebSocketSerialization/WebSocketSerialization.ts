// @ts-ignore
export const serialize = (message) => {
  return JSON.stringify(message)
}

// @ts-ignore
export const deserialize = (message) => {
  return JSON.parse(message.toString())
}
