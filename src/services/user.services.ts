import { RegisterRequestBody, EmailVerifyBody } from '~/models/requests/user.requests'
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

    const email_verify_subject = 'Xác nhận đăng ký tài khoản TANK-Travel'
    const email_verify_html = `
      <div style="margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background-color: #336699; color: white; text-align: center; padding: 20px;">
                <h1 style="margin: 0; font-size: 24px;">TANK-Travel</h1>
            </div>
            <div style="padding: 30px; text-align: center;">
                <p>Xin chào,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản TANK-Travel.</p>
                <p>Để xác thực tài khoản, vui lòng nhập mã sau:</p>
                
                <div style="background-color: #f0f0f0; border-radius: 10px; padding: 15px; margin: 20px 0; font-size: 36px; font-weight: bold; color: #336699; letter-spacing: 5px;">
                    ${code}
                </div>
                
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
            </div>
            <div style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #666;">
                Trân trọng,<br>
                Đội ngũ TANK-Travel
            </div>
        </div>
      </div>
    `

    await databaseService.emailVerifyCode.insertOne(new EmailVerifyCode({ email, code }))

    sendMail(email, email_verify_subject, email_verify_html)
  }
  async reSendEmailVerify(payload: EmailVerifyBody) {
    const email = payload.email
    const code = this.randomCode()

    const email_verify_subject = 'Xác nhận đăng ký tài khoản TANK-Travel'
    const email_verify_html = `
      <div style="margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background-color: #336699; color: white; text-align: center; padding: 20px;">
                <h1 style="margin: 0; font-size: 24px;">TANK-Travel</h1>
            </div>
            <div style="padding: 30px; text-align: center;">
                <p>Xin chào,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản TANK-Travel.</p>
                <p>Để xác thực tài khoản, vui lòng nhập mã sau:</p>
                
                <div style="background-color: #f0f0f0; border-radius: 10px; padding: 15px; margin: 20px 0; font-size: 36px; font-weight: bold; color: #336699; letter-spacing: 5px;">
                    ${code}
                </div>
                
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
            </div>
            <div style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #666;">
                Trân trọng,<br>
                Đội ngũ TANK-Travel
            </div>
        </div>
      </div>
    `

    await databaseService.emailVerifyCode.updateOne(
      {
        email
      },
      {
        $set: { code }
      }
    )

    sendMail(email, email_verify_subject, email_verify_html)
  }
  async register(payload: RegisterRequestBody) {
    await Promise.all([
      await databaseService.users.insertOne(
        new User({
          ...payload,
          password: HashPassword(payload.password)
        })
      ),
      databaseService.emailVerifyCode.deleteOne({ email: payload.email })
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

  // async verifyEmail(user_id: string) {
  //   const [token] = await Promise.all([
  //     this.signAccessTokenAndRefreshToken(user_id),
  //     databaseService.users.updateOne(
  //       {
  //         _id: new ObjectId(user_id)
  //       },
  //       {
  //         $set: { email_verify_token: '', updated_at: new Date(), user_type: UserStatus.Verified },
  //         $currentDate: { last_updated: true }
  //       }
  //     )
  //   ])

  //   const [access_token, refresh_token] = token

  //   await this.registerRefreshToken(user_id, refresh_token)

  //   return {
  //     access_token,
  //     refresh_token
  //   }
  // }
}

const services = new UserService()
export default services
