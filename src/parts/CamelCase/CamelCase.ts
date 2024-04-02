import * as Character from '../Character/Character.ts'

const firstLetterLowerCase = (string: string) => {
  return string[0].toLowerCase() + string.slice(1)
}

export const camelCase = (string: string) => {
  const parts = string.split(Character.Space)
  const lowerParts = parts.map(firstLetterLowerCase)
  return lowerParts.join(Character.Dash)
}
