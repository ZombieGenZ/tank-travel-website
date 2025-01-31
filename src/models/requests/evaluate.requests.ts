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
