export const handleUpgrade = async (...args) => {
  const module = await import('@lvce-editor/web-socket-server')
  // @ts-ignore
  return module.handleUpgrade(...args)
}
