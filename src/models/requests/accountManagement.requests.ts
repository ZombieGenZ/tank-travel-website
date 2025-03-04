export interface GetAccountRequestBody {
  refresh_token: string
  session_time: Date
  current: number
}

export interface FindAccountRequestBody {
  refresh_token: string
  session_time: Date
  keywords: string
  current: number
}

export interface BanAccountRequestBody {
  refresh_token: string
  user_id: string
  reason: string
  expired_at: Date
}

export interface UnBanAccountRequestBody {
  refresh_token: string
  user_id: string
}

export interface SendNotificationRequestBody {
  refresh_token: string
  user_id: string
  message: string
}
