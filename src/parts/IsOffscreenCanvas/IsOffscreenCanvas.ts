export const isOffscreenCanvas = (value: unknown): boolean => {
  return (
    typeof OffscreenCanvas !== 'undefined' && value instanceof OffscreenCanvas
  )
}
