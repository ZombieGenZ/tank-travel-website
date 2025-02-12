import axios from 'axios'
const baseUrl = 'https://api.hunter.io/v2/email-verifier'

export const getEmailInfomation = async (email: string) => {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        email: email,
        api_key: process.env.HUNTER_API_KEY
      }
    })

    const { data } = response.data

    if (data.status !== 'valid') {
      return false
    }

    if (data.disposable) {
      return false
    }

    return true
  } catch (err) {
    console.log(`Error: ${err}`)
    return false
  }
}
