import NotificationPrivate from '~/models/schemas/notificationPrivate.schemas'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/users.schemas'
import { db } from './firebase.services'
import { io } from '~/index'
import { GetNotificatonRequestBody } from '~/models/requests/notification-priate.requests'
import { NOTIFICATION_PRIATE_MESSAGE } from '~/constants/message'

class NotificationPrivateService {
  async createNotification(receiver_id: ObjectId, message: string, sender?: User) {
    const notificationFirebaseRealtime = db.ref(`notification/${receiver_id}`).push()
    const date = new Date()

    await Promise.all([
      databaseService.notificationPrivate.insertOne(
        new NotificationPrivate({
          receiver: receiver_id,
          sender: sender ? sender.display_name : 'Hệ thống',
          message,
          created_at: date
        })
      ),
      notificationFirebaseRealtime.set({
        sender: sender ? sender.display_name : 'Hệ thống',
        message
      }),
      io.to(`user-${receiver_id}`).emit('new-private-notificaton', {
        sender: sender ? sender.display_name : 'Hệ thống',
        message
      })
    ])
  }
  async getNotification(payload: GetNotificatonRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const result = await databaseService.notificationPrivate
      .aggregate([
        {
          $match: {
            created_at: { $lt: new Date(payload.session_time) },
            receiver: user._id
          }
        },
        { $sort: { created_at: -1 } },
        { $skip: payload.current },
        { $limit: next }
      ])
      .toArray()

    const continued = result.length > limit
    const notification = result.slice(0, limit)
    const current = payload.current + notification.length

    if (notification.length === 0) {
      return {
        message: NOTIFICATION_PRIATE_MESSAGE.NOTIFICATION_NOT_FOUND,
        current: payload.current,
        continued: false,
        notification: []
      }
    } else {
      return {
        current,
        continued,
        notification
      }
    }
  }
}

const notificationPrivateService = new NotificationPrivateService()
export default notificationPrivateService
