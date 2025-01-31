import { ObjectId } from 'mongodb'

interface BillType {
  _id?: ObjectId
  bus_route: ObjectId
  user: ObjectId
  booking_time?: Date
  totalPrice: number
  quantity: number
}

export default class Bill {
  _id: ObjectId
  bus_route: ObjectId
  user: ObjectId
  booking_time: Date
  totalPrice: number
  quantity: number
  constructor(bill: BillType) {
    this._id = bill._id || new ObjectId()
    this.bus_route = bill.bus_route
    this.user = bill.user
    this.booking_time = bill.booking_time || new Date()
    this.totalPrice = bill.totalPrice
    this.quantity = bill.quantity
  }
}
