import NotificationPrivate from '~/models/schemas/notificationPrivate.schemas'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/users.schemas'
import { db } from './firebase.services'
import { io } from '~/index'

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
}

const notificationPrivateService = new NotificationPrivateService()
export default notificationPrivateService
