import { ObjectId } from 'mongodb'
import { TicketStatus } from '~/constants/enum'

interface BillDetailType {
  _id?: ObjectId
  bill: ObjectId
  cancellation_time?: Date
  status?: TicketStatus
  name: string
  phone: string
  price: number
}

export class BillDetail {
  _id: ObjectId
  bill: ObjectId
  cancellation_time: Date
  status: TicketStatus
  name: string
  phone: string
  price: number
  constructor(billDetail: BillDetailType) {
    this._id = billDetail._id || new ObjectId()
    this.bill = billDetail.bill
    this.cancellation_time = new Date() // default null value
    this.status = billDetail.status || TicketStatus.PAID
    this.name = billDetail.name
    this.phone = billDetail.phone
    this.price = billDetail.price
  }
}
