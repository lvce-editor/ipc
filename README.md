# Lvce Editor Ipc

Inter Process Communiction for use in Lvce Editor.

### Usage

```js
import { IpcParentWithElectronUtilityProcess } from '@lvce-editor/ipc'

const rawIpc = await IpcParentWithElectronUtilityProcess.create({
  path: '/test/utility-process.js',
})

const ipc = IpcParentWithElectronUtilityProcess.wrap(rawIpc)

ipc.send({
  jsonrpc: '2.0',
  method: 'readFile',
  params: ['/test/file.txt'],
})
```
