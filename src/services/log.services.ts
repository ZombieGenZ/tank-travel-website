import { LogTypeEnum } from '~/constants/enum'
import databaseService from './database.services'
import Log from '~/models/schemas/log.schemas'
import { db } from './firebase.services'
import { io, runningTime } from '~/index'

class LogService {
  async newLog(log_type: LogTypeEnum, log_message: string, created_at?: Date) {
    const logFirebaseRealtime = db.ref(`log/${runningTime}`).push()
    const date = new Date()

    await Promise.all([
      databaseService.log.insertOne(
        new Log({
          log_type,
          content: log_message,
          time: created_at || date
        })
      ),
      logFirebaseRealtime.set({
        log_type,
        content: log_message,
        time: created_at || date
      }),
      io.to('system-log').emit('new-system-log', {
        log_type,
        content: log_message,
        time: created_at || date
      })
    ])
  }
}

const logService = new LogService()
export default logService
