export interface GetStatisticsRequestBody {
  refresh_token: string
}

export interface FindStatisticsRequestBody {
  refresh_token: string
  start_time: Date
  end_time: Date
}
