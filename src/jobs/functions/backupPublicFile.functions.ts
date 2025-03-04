import { uploadPuclicFolder } from '~/utils/drive'
import databaseService from '~/services/database.services'
import AccountmManagementService from '~/services/accountManagement.services'
import { writeInfoLog } from '~/utils/log'
import { formatDateFull2 } from '~/utils/date'

export const backupPublicFolder = async () => {
  const date = new Date()
  console.log('\x1b[33mĐang thực hiện sao lưu folder \x1b[36mUpload\x1b[33m...\x1b[0m')
  await uploadPuclicFolder(date)
  console.log('\x1b[33mSao lưu folder \x1b[36mUpload\x1b[33m thành công!\x1b[0m')
}

export const autoUnBanAccountExpiredBanned = async () => {
  const currentDate = new Date()
  const userBanned = await databaseService.users.find({ penalty: { $ne: null } }).toArray()

  for (const user of userBanned) {
    if (user.penalty == null) {
      continue
    }

    if (user.penalty.expired_at > currentDate) {
      AccountmManagementService.unBanAccount(user._id.toString())
      console.log(
        `\x1b[33mĐã tự động mở khóa tài khoản \x1b[36m${user.display_name}\x1b[33m (ID: \x1b[36m${user._id}\x1b[33m) thành công\x1b[0m`
      )
      await writeInfoLog(
        `Đã tự động mở khóa tài khoản ${user.display_name} (ID: ${user._id}) thành công (Time: ${formatDateFull2(currentDate)})`
      )
    }
  }
}
