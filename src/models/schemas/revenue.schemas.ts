import { ObjectId } from 'mongodb'
import { PaymentType, RevenueStatus } from '~/constants/enum'

interface RevenueType {
  _id?: ObjectId
  create_time?: Date
  amount: number
  type: PaymentType
  status?: RevenueStatus
}

class Revenue {
  _id: ObjectId
  create_time: Date
  amount: number
  type: PaymentType
  status: RevenueStatus
  constructor(revenue: RevenueType) {
    const date = new Date()

    this._id = revenue._id || new ObjectId()
    this.amount = revenue.amount
    this.type = revenue.type
    this.status = revenue.status || RevenueStatus.PENDING
    this.create_time = revenue.create_time || date
  }
}
