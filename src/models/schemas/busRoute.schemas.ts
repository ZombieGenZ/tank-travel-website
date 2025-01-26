import { ObjectId } from 'mongodb'

interface BusRouteType {
  _id?: ObjectId
  Vehicle: ObjectId
  start_point: string
  end_point: string
  departure_time: Date // thời gian khởi hành
  arrival_time: Date // thời gian dự kiến đến nơi
}

class BusRoute {
  _id?: ObjectId
  Vehicle: ObjectId
  start_point: string
  end_point: string
  departure_time: Date
  arrival_time: Date
  constructor(busRoute: BusRouteType) {
    this._id = busRoute._id || new ObjectId()
    this.Vehicle = busRoute.Vehicle
    this.start_point = busRoute.start_point
    this.end_point = busRoute.end_point
    this.departure_time = busRoute.departure_time
    this.arrival_time = busRoute.arrival_time
  }
}
