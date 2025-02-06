import { LogTypeEnum } from '~/constants/enum'
import databaseService from './database.services'
import Log from '~/models/schemas/log.schemas'
import { db } from './firebase.services'
import { io } from '~/index'

class LogService {
  async newLog(log_type: LogTypeEnum, log_message: string, created_at?: Date) {
    const logFirebaseRealtime = db.ref(`log`).push()

    await Promise.all([
      databaseService.log.insertOne(
        new Log({
          log_type,
          content: log_message,
          time: created_at || new Date()
        })
      ),
      logFirebaseRealtime.set({
        log_type,
        content: log_message,
        time: created_at || new Date()
      }),
      io.to('log').emit('new-log', {
        log_type,
        content: log_message,
        time: created_at || new Date()
      })
    ])
  }
}

const logService = new LogService()
export default logService
