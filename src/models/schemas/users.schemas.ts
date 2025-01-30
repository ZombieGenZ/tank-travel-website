import { ObjectId } from 'mongodb'
import { UserStatus, UserPermission } from '~/constants/enum'
import { ImageType } from '~/constants/image'

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
  forgot_password_token?: string
  avatar?: ImageType
  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id: ObjectId
  display_name: string
  email: string
  phone: string
  password: string
  user_type: UserStatus
  balance: number
  revenue: number
  permission: UserPermission
  forgot_password_token: string
  avatar: ImageType
  created_at: Date
  updated_at: Date
  constructor(user: UserType) {
    const date = new Date()
    const avatarImage: ImageType = {
      type: 'image/png',
      path: 'publc/images/system/avatar.png',
      url: `${process.env.APP_URL}/images/system/avatar.png`,
      size: 36634
    }

    this._id = user._id || new ObjectId()
    this.display_name = user.display_name
    this.email = user.email
    this.phone = user.phone
    this.password = user.password
    this.user_type = user.user_type || UserStatus.UnVerified
    this.balance = user.balance || 0
    this.revenue = user.revenue || 0
    this.permission = user.permission || UserPermission.CUSTOMER
    this.forgot_password_token = user.forgot_password_token || ''
    this.avatar = user.avatar || avatarImage
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
