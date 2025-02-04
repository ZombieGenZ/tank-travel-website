export interface RegisterRequestBody {
  name: string
  email: string
  phone: string
  have_account: boolean
}

export interface CensorRequestBody {
  refresh_token: string
  business_registration_id: string
  decision: boolean
}

export interface GetBusinessRegistrationRequestBody {
  refresh_token: string
  current: number
}
