import nodemailer from 'nodemailer'
import { OAuth2Client } from 'google-auth-library'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import QRCode from 'qrcode'

const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID as string
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET as string
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN as string
const GOOGLE_MAILER_EMAIL_ADDRESS = process.env.GOOGLE_MAILER_EMAIL_ADDRESS as string

const MailClient = new OAuth2Client(GOOGLE_MAILER_CLIENT_ID, GOOGLE_MAILER_CLIENT_SECRET)

MailClient.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})

const generateQRCodeAttachment = async (text: string) => {
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

export const sendMail = async (to: string, subject: string, html: string, qrCodeUrl?: string) => {
  try {
    const access_token_object = await MailClient.getAccessToken()
    const access_token = access_token_object?.token as string

    const transportOptions: SMTPTransport.Options = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: GOOGLE_MAILER_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: access_token
      }
    }

    const transport = nodemailer.createTransport(transportOptions)

    const mailOptions: nodemailer.SendMailOptions = {
      from: GOOGLE_MAILER_EMAIL_ADDRESS,
      to,
      subject,
      html
    }

    if (qrCodeUrl) {
      const qrAttachment = await generateQRCodeAttachment(qrCodeUrl)
      mailOptions.attachments = [qrAttachment]

      mailOptions.html = html.replace('src="${qrCode}"', 'src="cid:ticket-qr"')
    }

    await transport.sendMail(mailOptions)

    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
