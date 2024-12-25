export const isModuleNotFoundError = (stderr: string) => {
  if (!stderr) {
    return false
  }
  return stderr.includes('ERR_MODULE_NOT_FOUND')
}
