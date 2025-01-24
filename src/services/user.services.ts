import { RegisterRequestBody } from '~/models/requests/user.requests'
import databaseService from './database.services'
import { HashPassword } from '~/utils/encryption'
import User from '~/models/schemas/users.schemas'
import { signToken } from '~/utils/jwt'
import { TokenType, UserStatus } from '~/constants/enum'
import RefreshToken from '~/models/schemas/refreshtoken.schemas'
import { ObjectId } from 'mongodb'
import { sendMail } from '~/utils/mail'

class UserService {
  async checkEmailExits(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  async checkPhoneNumberExits(phone: string) {
    const user = await databaseService.users.findOne({ phone })
    return Boolean(user)
  }
  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token: email_verify_token,
        password: HashPassword(payload.password)
      })
    )

    const verify_email_html = `
      <div style="line-height: 1.6; color: #333; padding: 20px;">
        <div style="background-color: #0066cc; color: white; text-align: center; padding: 15px;">
            <h1 style="margin: 0;">TANK Travel</h1>
        </div>
        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
            <h2 style="color: #0066cc;">Xác Minh Địa Chỉ Email</h2>
            <p>Chào ${payload.display_name},</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại TANK Travel. Vui lòng nhấp vào nút bên dưới để xác minh địa chỉ email của bạn:</p>
            
            <a href="${process.env.APP_URL}/users/email-verify?token=${email_verify_token}" style="display: block; width: 200px; margin: 20px auto; padding: 12px; background-color: #28a745; color: white; text-align: center; text-decoration: none; border-radius: 5px;">
                Xác Minh Email
            </a>
            
            <p style="color: #d9534f;"><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 24 giờ.</p>
            <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
        </div>
        <div style="text-align: center; color: #777; margin-top: 20px; font-size: 12px;">
            <p>© 2024 TANK Travel. Bảo lưu mọi quyền.</p>
            <p>Không trả lời email này. Nếu cần hỗ trợ, vui lòng liên hệ dịch vụ khách hàng.</p>
        </div>
      </div>
    `

    sendMail(payload.email, `Xác nhận email ${payload.email} đã đăng ký tại TANK-Travel`, verify_email_html)

    // const result = await databaseService.users.insertOne(
    //   new User({
    //     ...payload,
    //     password: HashPassword(payload.password)
    //   })
    // )

    // const user_id = result.insertedId.toString()
    // const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)

    // await this.registerRefreshToken(user_id, refresh_token)

    // return {
    //   access_token,
    //   refresh_token
    // }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)

    await this.registerRefreshToken(user_id, refresh_token)

    return {
      access_token,
      refresh_token
    }
  }

  private signAccessToken(user_id: string) {
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
  private signRefreshToken(user_id: string) {
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

  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.SECURITY_JWT_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.SECURITY_EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  private async registerRefreshToken(user_id: string, token: string) {
    await databaseService.refreshToken.insertOne(new RefreshToken({ token, user_id: new ObjectId(user_id) }))
  }

  async logout(refresh_token: string) {
    await databaseService.refreshToken.deleteOne({ token: refresh_token })
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessTokenAndRefreshToken(user_id),
      databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        { $set: { email_verify_token: '', updated_at: new Date(), user_type: UserStatus.Verified } }
      )
    ])

    const [access_token, refresh_token] = token

    await this.registerRefreshToken(user_id, refresh_token)

    return {
      access_token,
      refresh_token
    }
  }
}

const services = new UserService()
export default services
