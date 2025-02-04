import { ObjectId } from 'mongodb'

interface BusinessRegistrationType {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  have_account?: boolean
  created_at?: Date
}

export default class BusinessRegistration {
  _id: ObjectId
  name: string
  email: string
  phone: string
  have_account: boolean
  created_at: Date
  constructor(businessRegistrationType: BusinessRegistrationType) {
    this._id = businessRegistrationType._id || new ObjectId()
    this.name = businessRegistrationType.name
    this.email = businessRegistrationType.email
    this.phone = businessRegistrationType.phone
    this.have_account = businessRegistrationType.have_account || false
    this.created_at = businessRegistrationType.created_at || new Date()
  }
}
