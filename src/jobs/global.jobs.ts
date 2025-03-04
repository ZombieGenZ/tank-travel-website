import cron from 'node-cron'
import { backupPublicFolder, autoUnBanAccountExpiredBanned } from './functions/backupPublicFile.functions'

const runAllCrons = () => {
  // Cron job dùng để backup file mỗi ngày vào lúc 6h sáng, 12h trưa và 18h chiều và 0h đêm
  cron.schedule('0 0,6,12,18 * * *', backupPublicFolder)
  cron.schedule('* * * * *', autoUnBanAccountExpiredBanned)
}

export default runAllCrons
