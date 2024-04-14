export const getWorkerDisplayName = (name: string) => {
  if (!name) {
    return '<unknown> worker'
  }
  if (name.endsWith('Worker') || name.endsWith('worker')) {
    return name.toLowerCase()
  }
  return `${name} Worker`
}
