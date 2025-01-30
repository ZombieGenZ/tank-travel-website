import QRCode from 'qrcode'

export const generateQRCode = async (text: string) => {
  try {
    const qrCode = await QRCode.toDataURL(text)
    return qrCode
  } catch (error) {
    console.error('Lỗi tạo mã QR:', error)
    throw error
  }
}
