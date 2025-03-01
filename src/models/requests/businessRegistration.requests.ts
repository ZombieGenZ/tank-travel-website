export interface RegisterRequestBody {
  name: string
  email: string
  phone: string
  have_account: boolean
  'cf-turnstile-response': string
}

export interface CensorRequestBody {
  refresh_token: string
  business_registration_id: string
  decision: boolean
}

export interface GetBusinessRegistrationRequestBody {
  refresh_token: string
  session_time: Date
  current: number
}
