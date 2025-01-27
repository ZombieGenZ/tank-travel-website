import { ObjectId } from 'mongodb'
import { TicketStatus } from '~/constants/enum'

interface BillType {
  _id?: ObjectId
  bus_route: ObjectId
  user: ObjectId
  booking_time?: Date
  cancellation_time?: Date
  status?: TicketStatus
  name: string
  phone: string
}

export class Bill {
  _id: ObjectId
  bus_route: ObjectId
  user: ObjectId
  booking_time: Date
  cancellation_time: Date
  status: TicketStatus
  name: string
  phone: string
  constructor(bill: BillType) {
    this._id = bill._id || new ObjectId()
    this.bus_route = new ObjectId(bill.bus_route)
    this.user = new ObjectId(bill.user)
    this.booking_time = bill.booking_time || new Date()
    this.cancellation_time = new Date() // default null value
    this.status = bill.status || TicketStatus.PAID
    this.name = bill.name
    this.phone = bill.phone
  }
}
