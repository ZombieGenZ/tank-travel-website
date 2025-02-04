export const generateRandomPassword = (length = 32) => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const allChars = [uppercaseChars, lowercaseChars, numberChars, specialChars]

  const getRandomChar = (charSet: string) => charSet[Math.floor(Math.random() * charSet.length)]

  const password = [
    getRandomChar(uppercaseChars),
    getRandomChar(lowercaseChars),
    getRandomChar(numberChars),
    getRandomChar(specialChars)
  ]

  while (password.length < length) {
    const randomCharSet = allChars[Math.floor(Math.random() * allChars.length)]
    password.push(getRandomChar(randomCharSet))
  }

  return password.sort(() => Math.random() - 0.5).join('')
}
