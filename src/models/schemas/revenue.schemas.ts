import { ObjectId } from 'mongodb'
import { PaymentType, RevenueStatus } from '~/constants/enum'
import { CardRevenue, BankRevenue } from '~/constants/revenue'

interface RevenueType {
  _id?: ObjectId
  type: PaymentType
  amount_received?: number
  payment_info: CardRevenue | BankRevenue | null
  status?: RevenueStatus
  create_time?: Date
}

export default class Revenue {
  _id: ObjectId
  type: PaymentType
  amount_received: number
  payment_info: CardRevenue | BankRevenue | null
  status: RevenueStatus
  create_time: Date
  constructor(revenue: RevenueType) {
    this._id = revenue._id || new ObjectId()
    this.type = revenue.type
    this.amount_received = revenue.amount_received || 0
    this.payment_info = revenue.payment_info || null
    this.status = revenue.status || RevenueStatus.PENDING
    this.create_time = revenue.create_time || new Date()
  }
}
