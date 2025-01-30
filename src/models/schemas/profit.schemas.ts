import { ObjectId } from 'mongodb'

interface ProfitType {
  _id?: ObjectId
  time?: string
  revenue?: number
  last_update?: Date
}

export class Profit {
  _id: ObjectId
  time: string
  revenue: number
  last_update: Date
  constructor(profit: ProfitType) {
    const date = new Date()

    this._id = profit._id || new ObjectId()
    this.time = profit.time || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    this.revenue = profit.revenue || 0
    this.last_update = profit.last_update || date
  }
}
