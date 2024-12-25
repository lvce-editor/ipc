export const isModulesSyntaxError = (stderr: string) => {
  if (!stderr) {
    return false
  }
  return stderr.includes('SyntaxError: Cannot use import statement outside a module')
}
