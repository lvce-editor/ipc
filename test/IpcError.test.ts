import { expect, test } from '@jest/globals'
import { IpcError } from '../src/parts/IpcError/IpcError.ts'

test('name', () => {
  expect(IpcError.name).toBe('IpcError')
})

test('module not found error', () => {
  const message = 'Utility Process exited before connection'
  const stdout = ''
  const stderr = `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/packages/shared-process/node_modules/@lvce-editor/embeds-process/src/embedsProcessMain-not.js' imported from /packages/main-process/`
  const error = new IpcError(message, stdout, stderr)
  // @ts-ignore
  expect(error.message).toBe(
    `Utility Process exited before connection: Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/packages/shared-process/node_modules/@lvce-editor/embeds-process/src/embedsProcessMain-not.js' imported from /packages/main-process/`,
  )
  // @ts-ignore
  expect(error.stack)
    .toMatch(`VError: Utility Process exited before connection: Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/packages/shared-process/node_modules/@lvce-editor/embeds-process/src/embedsProcessMain-not.js' imported from /packages/main-process/
    at`)
  // @ts-ignore
  expect(error.code).toBe(`ERR_MODULE_NOT_FOUND`)
})

test('another module not found error', () => {
  const message = 'Utility process exited before ipc connection was established'
  const stdout = ''
  const stderr = `node:internal/modules/esm/resolve:265
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/shared-process/node_modules/@lvce-editor/preview-process/dist/index.js' imported from /test/packages/main-process/
    at finalizeResolution (node:internal/modules/esm/resolve:265:11)
    at moduleResolve (node:internal/modules/esm/resolve:940:10)
    at defaultResolve (node:internal/modules/esm/resolve:1176:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:383:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:352:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:227:38)
    at ModuleLoader.import (node:internal/modules/esm/loader:315:34)
    at node:electron/js2c/utility_init:2:17513
    at asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:138:11)
    at runEntryPointWithESMLoader (node:internal/modules/run_main:162:19) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///test/packages/shared-process/node_modules/@lvce-editor/preview-process/dist/index.js'
}

Node.js v20.15.1`
  const error = new IpcError(message, stdout, stderr)
  // @ts-ignore
  expect(error.message).toBe(
    `Utility process exited before ipc connection was established: Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/shared-process/node_modules/@lvce-editor/preview-process/dist/index.js' imported from /test/packages/main-process/`,
  )
  // @ts-ignore
  expect(error.stack)
    .toMatch(`VError: Utility process exited before ipc connection was established: Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/shared-process/node_modules/@lvce-editor/preview-process/dist/index.js' imported from /test/packages/main-process/
    at`)
  // @ts-ignore
  expect(error.code).toBe(`ERR_MODULE_NOT_FOUND`)
})
