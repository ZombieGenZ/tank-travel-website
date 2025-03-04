import cron from 'node-cron'
import { backupPublicFolder } from './functions/backupUploadFile.functions'
import { autoUnBanAccountExpiredBanned } from './functions/autoUnBanAccountExpiredBanned.functions'
import { isLastDayOfMonth } from '~/utils/date'
import { automaticReward } from './functions/automaticReward.functions'

const runAllCrons = () => {
  // Cron job dùng để backup file mỗi ngày vào lúc 6h sáng, 12h trưa và 18h chiều và 0h đêm
  cron.schedule('0 0,6,12,18 * * *', backupPublicFolder)
  // Cron job dùng để tự động kiểm tra và tự động mở khóa tài khoản cho user khi đã hết thời gian bị cấm
  cron.schedule('* * * * *', autoUnBanAccountExpiredBanned)
  // Cron job dùng để trao giải cho các doanh nghiệp/quản trị viên có doanh thu cao nhất vào mỗi cuối tháng
  cron.schedule('0 0 * * *', () => {
    if (isLastDayOfMonth()) {
      automaticReward()
    }
  })
}

export default runAllCrons
