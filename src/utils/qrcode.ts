import QRCode from 'qrcode'

export const generateQRCodeAttachment = async (text: string) => {
  try {
    const qrBuffer = await QRCode.toBuffer(text)
    return {
      filename: 'ticket-qr.png',
      content: qrBuffer,
      contentType: 'image/png',
      cid: 'ticket-qr'
    }
  } catch (error) {
    console.error('Lỗi tạo mã QR:', error)
    throw error
  }
}
