export interface CreateEvaluateRequestBody {
  refresh_token: string
  vehicle_id: string
  rating: number
  content: string
}

export interface UpdateEvaluateRequestBody {
  refresh_token: string
  evaluate_id: string
  rating: number
  content: string
}

export interface DeleteEvaluateRequestBody {
  refresh_token: string
  evaluate_id: string
}

export interface GetEvaluateRequestBody {
  refresh_token: string
  session_time: Date
  current: number
}

export interface CreateFeedbackRequestBody {
  refresh_token: string
  evaluate_id: string
  content: string
}

export interface UpdateFeedbackRequestBody {
  refresh_token: string
  evaluate_id: string
  content: string
}

export interface DeleteFeedbackRequestBody {
  refresh_token: string
  evaluate_id: string
}

export interface GetEvaluateListRequestBody {
  vehicle_id: string
  session_time: Date
  current: number
}
