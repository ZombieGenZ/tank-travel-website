import cron from 'node-cron'
import { backupPublicFolder } from './functions/backupPublicFile.functions'

const runAllCrons = () => {
  // Cron job dùng để backup file mỗi ngày vào lúc 0h đêm và 12h trưa
  cron.schedule('0 0,12 * * *', backupPublicFolder)
}

export default runAllCrons
