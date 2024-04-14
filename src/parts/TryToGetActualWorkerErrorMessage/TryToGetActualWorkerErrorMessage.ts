import * as GetWorkerDisplayName from '../GetWorkerDisplayName/GetWorkerDisplayName.ts'

export const tryToGetActualErrorMessage = async ({ name }: { name: string }) => {
  const displayName = GetWorkerDisplayName.getWorkerDisplayName(name)
  return `Failed to start ${displayName}: Worker Launch Error`
}
