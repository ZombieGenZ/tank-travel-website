export interface GetAccountRequestBody {
  refresh_token: string
  current: number
}

export interface FindAccountRequestBody {
  refresh_token: string
  keywords: string
  current: number
}

export interface BanAccountRequestBody {
  refresh_token: string
  user_id: string
  reason: string
  expired_at: Date
}
