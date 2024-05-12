import { expect, test } from '@jest/globals'
import { IpcError } from '../src/parts/IpcError/IpcError.ts'

test('name', () => {
  expect(IpcError.name).toBe('IpcError')
})


test('module not found error', async () => {
  const message = 'Utility Process exited before connection'
  const stdout = ''
  const stderr = `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/packages/shared-process/node_modules/@lvce-editor/embeds-process/src/embedsProcessMain-not.js' imported from /packages/main-process/`
  const error = new IpcError(message, stdout, stderr)
  // @ts-ignore
  expect(error.message).toBe(`Utility Process exited before connection: Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/packages/shared-process/node_modules/@lvce-editor/embeds-process/src/embedsProcessMain-not.js' imported from /packages/main-process/`)
  // @ts-ignore
  expect(error.stack).toMatch(`VError: Utility Process exited before connection: Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/packages/shared-process/node_modules/@lvce-editor/embeds-process/src/embedsProcessMain-not.js' imported from /packages/main-process/
    at`)
  // @ts-ignore
  expect(error.code).toBe(`ERR_MODULE_NOT_FOUND`)
})
