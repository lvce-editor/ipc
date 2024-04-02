import * as Character from '../Character/Character.ts'

export const joinLines = (lines: readonly string[]) => {
  return lines.join(Character.NewLine)
}
