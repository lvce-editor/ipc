import * as WalkValue from '../WalkValue/WalkValue.ts'

// workaround for electron not supporting transferrable objects
// as parameters. If the transferrable object is a parameter, in electron
// only an empty objected is received in the main process
export const fixElectronParameters = (value: unknown) => {
  const transfer: any[] = []
  const newValue = WalkValue.walkValue(value, transfer)
  return {
    newValue,
    transfer,
  }
}
