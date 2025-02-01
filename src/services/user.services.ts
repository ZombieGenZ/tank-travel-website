import {
  RegisterRequestBody,
  EmailVerifyBody,
  SendForgotPasswordBody,
  ForgotPasswordBody
} from '~/models/requests/user.requests'
import databaseService from './database.services'
import { HashPassword } from '~/utils/encryption'
import User from '~/models/schemas/users.schemas'
import { signToken } from '~/utils/jwt'
import { TokenType, UserStatus } from '~/constants/enum'
import RefreshToken from '~/models/schemas/refreshtoken.schemas'
import { ObjectId } from 'mongodb'
import { sendMail } from '~/utils/mail'
import EmailVerifyCode from '~/models/schemas/emailverifycode.schemas'

class UserService {
  async checkEmailExits(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async checkPhoneNumberExits(phone: string) {
    const user = await databaseService.users.findOne({ phone })
    return Boolean(user)
  }

  private randomCode() {
    return Math.floor(100000000 + Math.random() * 999999999).toString()
  }

  async sendEmailVerify(payload: EmailVerifyBody) {
    const email = payload.email
    const code = this.randomCode()

    const email_verify_subject = `Xác nhận đăng ký tài khoản - ${process.env.TRADEMARK_NAME}`
    const email_verify_html = `
      <div style="margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background-color: #336699; color: white; text-align: center; padding: 20px;">
                <h1 style="margin: 0; font-size: 24px;">${process.env.TRADEMARK_NAME}</h1>
            </div>
            <div style="padding: 30px; text-align: center;">
                <p>Xin chào,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản ${process.env.TRADEMARK_NAME}.</p>
                <p>Để xác thực tài khoản, vui lòng nhập mã sau:</p>
                
                <div style="background-color: #f0f0f0; border-radius: 10px; padding: 15px; margin: 20px 0; font-size: 36px; font-weight: bold; color: #336699; letter-spacing: 5px;">
                    ${code}
                </div>
                
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
            </div>
            <div style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #666;">
                Trân trọng,<br>
                Đội ngũ ${process.env.TRADEMARK_NAME}
            </div>
        </div>
      </div>
    `

    await Promise.all([
      databaseService.emailVerifyCodes.insertOne(new EmailVerifyCode({ email, code })),
      sendMail(email, email_verify_subject, email_verify_html)
    ])
  }

  async reSendEmailVerify(payload: EmailVerifyBody) {
    const email = payload.email
    const code = this.randomCode()

    const email_verify_subject = `Xác nhận đăng ký tài khoản - ${process.env.TRADEMARK_NAME}`
    const email_verify_html = `
      <div style="margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background-color: #336699; color: white; text-align: center; padding: 20px;">
                <h1 style="margin: 0; font-size: 24px;">${process.env.TRADEMARK_NAME}</h1>
            </div>
            <div style="padding: 30px; text-align: center;">
                <p>Xin chào,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản ${process.env.TRADEMARK_NAME}.</p>
                <p>Để xác thực tài khoản, vui lòng nhập mã sau:</p>
                
                <div style="background-color: #f0f0f0; border-radius: 10px; padding: 15px; margin: 20px 0; font-size: 36px; font-weight: bold; color: #336699; letter-spacing: 5px;">
                    ${code}
                </div>
                
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
            </div>
            <div style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #666;">
                Trân trọng,<br>
                Đội ngũ ${process.env.TRADEMARK_NAME}
            </div>
        </div>
      </div>
    `

    await Promise.all([
      databaseService.emailVerifyCodes.updateOne(
        {
          email
        },
        {
          $set: { code }
        }
      ),
      sendMail(email, email_verify_subject, email_verify_html)
    ])
  }

  async register(payload: RegisterRequestBody) {
    const email_verify_subject = `Chào mừng đến ${process.env.TRADEMARK_NAME}`
    const email_verify_html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 15px;">
                  <h1>Chào mừng đến ${process.env.TRADEMARK_NAME}</h1>
              </div>
              <div style="margin-top: 20px;">
                  <p>Kính chào Quý Khách,</p>
                  
                  <p>Chúc mừng bạn đã trở thành thành viên của ${process.env.TRADEMARK_NAME}! Chúng tôi rất vui mừng được đồng hành cùng bạn trong những chuyến du lịch sắp tới.</p>
                  
                  <p>Với ${process.env.TRADEMARK_NAME}, bạn sẽ được:</p>
                  <ul>
                      <li>Đặt vé máy bay, xe khách, tàu hỏa dễ dàng</li>
                      <li>Nhận ưu đãi đặc biệt cho thành viên</li>
                      <li>Hỗ trợ 24/7 khi bạn cần</li>
                  </ul>
                  
                  <a href="${process.env.APP_URL}/" style="display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Bắt đầu đặt vé ngay</a>
              </div>
              <div style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 0.9em;">
                  <p>© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Mọi quyền được bảo lưu.</p>
              </div>
          </div>
      </div>
    `

    await Promise.all([
      await databaseService.users.insertOne(
        new User({
          ...payload,
          password: HashPassword(payload.password),
          user_type: UserStatus.Verified
        })
      ),
      databaseService.emailVerifyCodes.deleteOne({ email: payload.email }),
      sendMail(payload.email, email_verify_subject, email_verify_html)
    ])
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)

    await this.registerRefreshToken(user_id, refresh_token)

    return {
      access_token,
      refresh_token
    }
  }

  signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.SECURITY_JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.SECURITY_ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.SECURITY_REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  signForgotPassword(user_id: string) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: process.env.SECURITY_JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.SECURITY_FORGOT_PASSWORD_EXPIRES_IN
      }
    })
  }

  private signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async registerRefreshToken(user_id: string, token: string) {
    await databaseService.refreshToken.insertOne(new RefreshToken({ token, user_id: new ObjectId(user_id) }))
  }

  async changeRefreshToken(user_id: string, token: string) {
    await databaseService.refreshToken.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: { refresh_token: token }
      }
    )
  }

  async logout(refresh_token: string) {
    await databaseService.refreshToken.deleteOne({ token: refresh_token })
  }

  async sendEmailForgotPassword(payload: SendForgotPasswordBody, user: User) {
    const token = await this.signForgotPassword(user._id.toString())
    const url = `${process.env.APP_URL}/forgot-password?token=${token}`

    const email_forgot_password_subject = `Yêu cầu đặt lại mật khẩu - ${process.env.TRADEMARK_NAME}`
    const email_forgot_password_html = `
      <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; padding: 20px;">
                  <h1 style="color: #333333; margin: 0;">${process.env.TRADEMARK_NAME}</h1>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h2 style="color: #333333; margin-top: 0;">Xác nhận đổi mật khẩu</h2>
                  
                  <p style="color: #666666; line-height: 1.6;">
                      Xin chào quý khách,
                  </p>
                  
                  <p style="color: #666666; line-height: 1.6;">
                      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản ${process.env.TRADEMARK_NAME} của quý khách. Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu của quý khách:
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${url}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Đặt lại mật khẩu</a>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6;">
                      Nếu quý khách không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi nếu quý khách có bất kỳ thắc mắc nào.
                  </p>
                  
                  <p style="color: #666666; line-height: 1.6;">
                      Lưu ý: Liên kết này sẽ hết hạn sau 24 giờ vì lý do bảo mật.
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                  
                  <p style="color: #999999; font-size: 12px; text-align: center;">
                      Email này được gửi tự động từ ${process.env.TRADEMARK_NAME}. Vui lòng không trả lời email này.
                  </p>
              </div>
              
              <div style="text-align: center; padding: 20px; color: #999999; font-size: 12px;">
                  <p>© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Mọi quyền được bảo lưu.</p>
              </div>
          </div>
      </d>
    `

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            forgot_password_token: token
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      sendMail(payload.email, email_forgot_password_subject, email_forgot_password_html)
    ])
  }

  async forgotPassword(payload: ForgotPasswordBody, user_id: string) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: HashPassword(payload.new_password),
          forgot_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }
}

const userService = new UserService()
export default userService
