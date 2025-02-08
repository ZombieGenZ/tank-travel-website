import { ObjectId } from 'mongodb'
import { NotificationStatus } from '~/constants/enum'

interface NotificationPrivateTyoe {
  _id?: ObjectId
  receiver: ObjectId
  sender?: string
  message: string
  status?: NotificationStatus
  created_at?: Date
}

export default class NotificationPrivate {
  _id: ObjectId
  receiver: ObjectId
  sender: string
  message: string
  status: NotificationStatus
  created_at: Date

  constructor(notification: NotificationPrivateTyoe) {
    this._id = notification._id || new ObjectId()
    this.receiver = notification.receiver
    this.sender = notification.sender || 'Hệ thống'
    this.message = notification.message
    this.status = notification.status || NotificationStatus.SENT
    this.created_at = notification.created_at || new Date()
  }
}
