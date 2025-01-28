import { ObjectId } from 'mongodb'

interface BusRouteType {
  _id?: ObjectId
  vehicle: ObjectId
  start_point: string
  end_point: string
  departure_time: Date // thời gian khởi hành
  arrival_time: Date // thời gian dự kiến đến nơi
  price: number
  quantity: number
  sold?: number
  created_at?: Date
  updated_at?: Date
}

export class BusRoute {
  _id: ObjectId
  vehicle: ObjectId
  start_point: string
  end_point: string
  departure_time: Date
  arrival_time: Date
  price: number
  quantity: number
  sold: number
  created_at: Date
  updated_at: Date
  constructor(busRoute: BusRouteType) {
    const date = new Date()

    this._id = busRoute._id || new ObjectId()
    this.vehicle = busRoute.vehicle
    this.start_point = busRoute.start_point
    this.end_point = busRoute.end_point
    this.departure_time = busRoute.departure_time
    this.arrival_time = busRoute.arrival_time
    this.price = busRoute.price
    this.quantity = busRoute.quantity
    this.sold = busRoute.sold || 0
    this.created_at = busRoute.created_at || date
    this.updated_at = busRoute.updated_at || date
  }
}
