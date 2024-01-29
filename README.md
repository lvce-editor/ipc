# Lvce Editor Ipc

Inter Process Communiction for use in Lvce Editor.

### Usage

```js
import { IpcParent, IpcParentType } from '@lvce-editor/ipc'

const ipc = await IpcParent.create({
  method: IpcParentType.NodeWorker,
  path: '/test/worker.js',
})

ipc.send({
  jsonrpc: '2.0',
  method: 'readFile',
  params: ['/test/file.txt'],
})
```
