export const isMessagePortMain = (value: unknown) => {
  return value && value.constructor && value.constructor.name === 'MessagePortMain'
}
