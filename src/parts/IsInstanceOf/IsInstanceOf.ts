export const isInstanceOf = (value: unknown, constructorName: string) => {
  return value?.constructor?.name === constructorName
}
