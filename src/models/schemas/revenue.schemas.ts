import { ObjectId } from 'mongodb'
import { PaymentType, RevenueStatus } from '~/constants/enum'
import { CardRevenue, BankRevenue } from '~/constants/revenue'

interface RevenueType {
  _id?: ObjectId
  type: PaymentType
  amount_deposit: number
  amount_received?: number
  payment_info?: CardRevenue | BankRevenue | null
  user: ObjectId
  status?: RevenueStatus
  created_at?: Date
  updated_at?: Date
}

export default class Revenue {
  _id: ObjectId
  type: PaymentType
  amount_deposit: number
  amount_received: number
  payment_info: CardRevenue | BankRevenue | null
  user: ObjectId
  status: RevenueStatus
  created_at: Date
  updated_at: Date
  constructor(revenue: RevenueType) {
    const date = new Date()

    this._id = revenue._id || new ObjectId()
    this.type = revenue.type
    this.amount_deposit = revenue.amount_deposit
    this.amount_received = revenue.amount_received || 0
    this.payment_info = revenue.payment_info || null
    this.user = revenue.user
    this.status = revenue.status || RevenueStatus.PENDING
    this.created_at = revenue.created_at || date
    this.updated_at = date
  }
}
