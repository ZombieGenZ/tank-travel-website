import {
  RegisterRequestBody,
  CensorRequestBody,
  GetBusinessRegistrationRequestBody
} from '~/models/requests/businessRegistration.requests'
import databaseService from './database.services'
import BusinessRegistration from '~/models/schemas/businessregistration.schemas'
import { sendMail } from '~/utils/mail'
import { UserPermission, UserStatus } from '~/constants/enum'
import axios from 'axios'
import User from '~/models/schemas/users.schemas'
import { HashPassword } from '~/utils/encryption'
import { generateRandomPassword } from '~/utils/password'
import { BUSINESS_REGISTRATION_MESSAGE } from '~/constants/message'

class BusinessRegistrationService {
  async register(payload: RegisterRequestBody) {
    await databaseService.businessRegistration.insertOne(
      new BusinessRegistration({
        ...payload
      })
    )
  }
  async censor(payload: CensorRequestBody, businessRegistration: BusinessRegistration) {
    const email_refuse_subject = `Thông Báo Từ Chối Đăng Ký Doanh Nghiệp ${process.env.TRADEMARK_NAME}`
    const email_refuse_html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 30px;">
              <h1 style="color: #333; text-align: center; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
                  Thông Báo Từ Chối Đăng Ký Doanh Nghiệp
              </h1>
              
              <p style="line-height: 1.6; color: #555; margin-bottom: 20px;">
                  Kính gửi Quý Doanh Nghiệp,
              </p>
              
              <div style="background-color: #f8d7da; border-left: 5px solid #dc3545; padding: 15px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #721c24;">
                      Chúng tôi xin thông báo rằng đơn đăng ký trở thành đối tác của <strong>${process.env.TRADEMARK_NAME}</strong> đã không được chấp thuận.
                  </p>
              </div>
              
              <div style="margin-bottom: 20px;">
                  <h2 style="color: #dc3545;">Lý Do Từ Chối</h2>
                  <p style="color: #555;">
                      Sau quá trình xem xét kỹ lưỡng, chúng tôi nhận thấy đơn đăng ký của Quý Doanh Nghiệp chưa đáp ứng đầy đủ các tiêu chí yêu cầu. Một số nguyên nhân có thể bao gồm:
                  </p>
                  <ul style="color: #555; padding-left: 20px;">
                      <li style="margin-bottom: 10px;">Hồ sơ không đầy đủ hoặc thiếu thông tin quan trọng</li>
                      <li style="margin-bottom: 10px;">Không đáp ứng các yêu cầu về năng lực và chuyên môn</li>
                      <li style="margin-bottom: 10px;">Không phù hợp với chiến lược phát triển của ${process.env.TRADEMARK_NAME}</li>
                  </ul>
              </div>
              
              <p style="color: #555; margin-bottom: 20px;">
                  Chúng tôi khuyến khích Quý Doanh Nghiệp có thể cải thiện hồ sơ và nộp lại trong những đợt tuyển chọn tiếp theo.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center;">
                  <p style="margin: 0; color: #6c757d;">
                      Trân trọng,<br>
                      Đội Ngũ <strong>${process.env.TRADEMARK_NAME}</strong>
                  </p>
              </div>
              
              <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #888;">
                  <p>© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Mọi quyền được bảo lưu.</p>
              </div>
          </div>
      </div>
    `

    if (!payload.decision) {
      await Promise.all([
        databaseService.businessRegistration.deleteOne({
          _id: businessRegistration._id
        }),
        sendMail(businessRegistration.email, email_refuse_subject, email_refuse_html)
      ])
      return
    }

    const email_acceptance_subject = `Thông Báo Chấp Thuận Đăng Ký Doanh Nghiệp ${process.env.TRADEMARK_NAME}`
    const email_acceptance_html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 30px;">
              <h1 style="color: #333; text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                  Thông Báo Chấp Thuận Đăng Ký Doanh Nghiệp
              </h1>
              
              <p style="line-height: 1.6; color: #555; margin-bottom: 20px;">
                  Kính gửi Quý Doanh Nghiệp,
              </p>
              
              <div style="background-color: #e9f7ef; border-left: 5px solid #28a745; padding: 15px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #155724;">
                      Chúng tôi rất hân hạnh thông báo rằng đơn đăng ký trở thành đối tác của <strong>${process.env.TRADEMARK_NAME}</strong> đã được chấp thuận thành công.
                  </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                  <a href="${process.env.APP_URL}/download/app" style="display: inline-block; background-color: #2ecc71; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      Tài phần mềm quản lý
                  </a>
              </div>

              <p style="color: #555; margin-bottom: 20px;">
                  Đội ngũ <strong>${process.env.TRADEMARK_NAME}</strong> rất mong được hợp tác và phát triển cùng Quý Doanh Nghiệp.
              </p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center;">
                  <p style="margin: 0; color: #6c757d;">
                      Trân trọng,<br>
                      Đội Ngũ <strong>${process.env.TRADEMARK_NAME}</strong>
                  </p>
              </div>
              
              <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #888;">
                  <p>© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Mọi quyền được bảo lưu.</p>
              </div>
          </div>
      </div>
    `

    if (businessRegistration.have_account) {
      await Promise.all([
        databaseService.businessRegistration.deleteOne({
          _id: businessRegistration._id
        }),
        databaseService.users.updateOne(
          {
            email: businessRegistration.email
          },
          {
            $set: {
              permission: UserPermission.BUSINESS
            },
            $currentDate: {
              updated_at: true
            }
          }
        ),
        sendMail(businessRegistration.email, email_acceptance_subject, email_acceptance_html)
      ])
      return
    }

    const password = generateRandomPassword()

    const email_account_subject = `Thông Tin Đăng Nhập Tài Khoản ${process.env.TRADEMARK_NAME}`
    const email_account_html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 10px;">${process.env.TRADEMARK_NAME}</h1>
                  <p style="color: #7f8c8d; font-size: 16px;">Tài Khoản Doanh Nghiệp Của Bạn</p>
              </div>

              <div style="background-color: #f9f9f9; border-left: 4px solid #3498db; padding: 15px; margin-bottom: 20px;">
                  <p style="margin: 0; font-weight: bold; color: #2980b9;">Thông Tin Đăng Nhập</p>
              </div>

              <div style="margin-bottom: 20px;">
                  <p style="margin: 5px 0;">
                      <strong style="color: #2c3e50;">Tên Đăng Nhập:</strong> 
                      <span style="color: #34495e; background-color: #ecf0f1; padding: 2px 5px; border-radius: 3px;">${businessRegistration.email}</span>
                  </p>
                  <p style="margin: 5px 0;">
                      <strong style="color: #2c3e50;">Mật Khẩu:</strong> 
                      <span style="color: #34495e; background-color: #ecf0f1; padding: 2px 5px; border-radius: 3px;">${password}</span>
                  </p>
              </div>

              <div style="background-color: #e8f4f8; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #2980b9; font-size: 14px;">
                      <strong>Lưu Ý:</strong> Vì lý do bảo mật, vui lòng thay đổi mật khẩu ngay sau lần đăng nhập đầu tiên.
                  </p>
              </div>

              <div style="text-align: center; margin-top: 20px; border-top: 1px solid #ecf0f1; padding-top: 15px;">
                  <p style="color: #7f8c8d; font-size: 12px;">
                      © ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Bảo lưu mọi quyền.
                  </p>
              </div>
          </div>
      </div>
    `

    Promise.all([
      databaseService.businessRegistration.deleteOne({
        _id: businessRegistration._id
      }),
      databaseService.users.insertOne(
        new User({
          display_name: businessRegistration.name,
          email: businessRegistration.email,
          phone: businessRegistration.phone,
          password: HashPassword(password),
          permission: UserPermission.BUSINESS,
          temporary: true,
          user_type: UserStatus.Verified
        })
      ),
      sendMail(businessRegistration.email, email_account_subject, email_account_html),
      sendMail(businessRegistration.email, email_acceptance_subject, email_acceptance_html)
    ])
  }

  async getBusinessRegistration(payload: GetBusinessRegistrationRequestBody) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const result = await databaseService.businessRegistration
      .find({})
      .sort({ created_at: -1 })
      .skip(payload.current)
      .limit(next)
      .toArray()

    const continued = result.length > limit

    const business_registration = result.slice(0, limit)

    const current = payload.current + business_registration.length

    if (business_registration.length === 0) {
      return {
        message: BUSINESS_REGISTRATION_MESSAGE.NO_MATCHING_RESULTS_FOUND,
        current: payload.current,
        continued: false,
        vehicle: []
      }
    } else {
      return {
        current,
        continued,
        business_registration
      }
    }
  }
}

const businessRegistrationService = new BusinessRegistrationService()
export default businessRegistrationService
