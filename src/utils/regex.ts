export const createRegexPattern = (input: string) => {
  const words = input.trim().split(/\s+/)
  const escapedWords = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return escapedWords.map((word) => `(?=.*${word})`).join('') + '.*'
}
