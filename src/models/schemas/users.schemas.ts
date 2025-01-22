import { ObjectId } from 'mongodb'
import { UserStatus, UserPermission } from '~/constants/enum'

interface UserType {
  _id?: ObjectId
  display_name: string
  email: string
  phone: string
  password: string
  user_type?: UserStatus
  balance?: number
  revenue?: number
  permission?: UserPermission
  email_verify_token?: string
  forgot_password_token?: string
}

export class User {
  _id: ObjectId
  display_name: string
  email: string
  phone: string
  password: string
  user_type: UserStatus
  balance: number
  revenue: number
  permission: UserPermission
  email_verify_token: string
  forgot_password_token: string

  constructor(user: UserType) {
    this._id = user._id || new ObjectId()
    this.display_name = user.display_name
    this.email = user.email
    this.phone = user.phone
    this.password = user.password
    this.user_type = user.user_type || UserStatus.UnVerified
    this.balance = user.balance || 0
    this.revenue = 0
    this.permission = user.permission || UserPermission.CUSTOMER
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
  }
}
