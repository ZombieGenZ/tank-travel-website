import { compressPuclicFolder } from '~/utils/compress'

export const backupPublicFolder = async () => {
  const date = new Date()
  console.log('\x1b[33mĐang thực hiện sao lưu folder \x1b[36mUpload\x1b[33m...\x1b[0m')
  await compressPuclicFolder(date)
  console.log('\x1b[33mSao lưu folder \x1b[36mUpload\x1b[33m thành công!\x1b[0m')
}
