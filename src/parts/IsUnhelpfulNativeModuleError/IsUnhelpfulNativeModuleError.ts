const RE_NATIVE_MODULE_ERROR = /^innerError Error: Cannot find module '.*.node'/
const RE_NATIVE_MODULE_ERROR_2 = /was compiled against a different Node.js version/

export const isUnhelpfulNativeModuleError = (stderr: string) => {
  return RE_NATIVE_MODULE_ERROR.test(stderr) && RE_NATIVE_MODULE_ERROR_2.test(stderr)
}
