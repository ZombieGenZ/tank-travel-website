export interface OrderRequestBody {
  refresh_token: string
  bus_route_id: string
  name: string
  phone: string
  quantity: number
}

export interface GetOrderRequestBody {
  refresh_token: string
  current: number
}

export interface GetOrderDetailRequestBody {
  refresh_token: string
  order_id: string
  current: number
}

export interface CancelTicketRequestBody {
  refresh_token: string
  ticket_id: string
}
