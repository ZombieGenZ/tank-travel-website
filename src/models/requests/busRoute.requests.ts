export interface CreateBusRouteRequestBody {
  refresh_token: string
  vehicle_id: string
  start_point: string
  end_point: string
  departure_time: Date
  arrival_time: Date
  price: number
  quantity: number
}

export interface UpdateBusRouteRequestBody {
  refresh_token: string
  bus_route_id: string
  vehicle_id: string
  start_point: string
  end_point: string
  departure_time: Date
  arrival_time: Date
  price: number
  quantity: number
}

export interface DeleteBusRouteRequestBody {
  refresh_token: string
  bus_route_id: string
}

export interface GetBusRouteRequestBody {
  refresh_token: string
  session_time: Date
  current: number
}

export interface FindBusRouteRequestBody {
  refresh_token: string
  session_time: Date
  current: number
  keywords: string
}

export interface GetBusRouteListRequestBody {
  session_time: Date
  current: number
}

export interface FindBusRouteListRequestBody {
  session_time: Date
  vehicle_type: number
  start_point: string
  end_point: string
  departure_time: Date
  current: number
}
