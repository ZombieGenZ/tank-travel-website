import {
  CensorVehicleRequestBody,
  CreateVehicleRequestBody,
  FindVehicleRequestBody,
  GetVehicleRequestBody,
  UpdateVehicleRequestBody
} from '~/models/requests/vehicle.requests'
import databaseService from './database.services'
import Vehicle from '~/models/schemas/vehicle.chemas'
import { ImageType } from '~/constants/image'
import { ObjectId } from 'mongodb'
import fs from 'fs'
import { VEHICLE_MESSGAE } from '~/constants/message'
import { SeatType, UserPermission, VehicleStatus, VehicleTypeEnum } from '~/constants/enum'
import { sendMail } from '~/utils/mail'
import { ErrorWithStatus } from '~/models/errors'
import HTTPSTATUS from '~/constants/httpStatus'
import User from '~/models/schemas/users.schemas'

class VehicleService {
  async createVehicle(payload: CreateVehicleRequestBody, user: User, preview: ImageType[]) {
    if (user.permission === UserPermission.ADMINISTRATOR) {
      await databaseService.vehicles.insertOne(
        new Vehicle({
          ...payload,
          user: user._id,
          preview: preview,
          status: VehicleStatus.ACCEPTED
        })
      )
    } else {
      await databaseService.vehicles.insertOne(
        new Vehicle({
          ...payload,
          user: user._id,
          preview: preview
        })
      )
    }
  }

  async updateVehicle(payload: UpdateVehicleRequestBody) {
    await databaseService.vehicles.updateOne(
      { _id: new ObjectId(payload.vehicle_id) },
      {
        $set: {
          vehicle_type: payload.vehicle_type,
          seat_type: payload.seat_type,
          seats: payload.seats,
          rules: payload.rules,
          amenities: payload.amenities,
          license_plate: payload.license_plate,
          status: VehicleStatus.PENDING_APPROVAL
        },
        $currentDate: { updated_at: true }
      }
    )
  }

  async deleteVehicle(vehicle: Vehicle) {
    const promises = [] as Promise<void>[]

    vehicle.preview.forEach(async (file) => {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            fs.unlinkSync(file.path)
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    })

    await databaseService.vehicles.deleteOne({ _id: new ObjectId(vehicle._id) })

    await Promise.allSettled(promises)
  }

  async getVehicle(payload: GetVehicleRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const result = await databaseService.vehicles
        .find({})
        .project({ preview: 0 })
        .sort({ created_at: -1 })
        .skip(payload.current)
        .limit(next)
        .toArray()

      const continued = result.length > limit

      const vehicle = result.slice(0, limit)

      const current = payload.current + vehicle.length

      if (vehicle.length === 0) {
        return {
          message: VEHICLE_MESSGAE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          vehicle
        }
      }
    } else {
      const result = await databaseService.vehicles
        .find({ user: user._id })
        .project({ preview: 0 })
        .sort({ created_at: -1 })
        .skip(payload.current)
        .limit(next)
        .toArray()

      const continued = result.length > limit

      const vehicle = result.slice(0, limit)

      const current = payload.current + vehicle.length

      if (vehicle.length === 0) {
        return {
          message: VEHICLE_MESSGAE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          vehicle
        }
      }
    }
  }

  async getVehiclePreview(vehicle: Vehicle) {
    const result = await databaseService.vehicles.findOne(
      { _id: new ObjectId(vehicle._id) },
      { projection: { 'preview.url': 1 } }
    )

    return result?.preview?.map((item) => item.url) || []
  }

  async findVehicle(payload: FindVehicleRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const keywords = payload.keywords.split(' ')

      const searchQuery = {
        $or: keywords.map((key) => ({
          $or: [
            { rules: { $regex: key, $options: 'i' } },
            { amenities: { $regex: key, $options: 'i' } },
            { license_plate: { $regex: key, $options: 'i' } },

            ...(isNaN(Number(key))
              ? []
              : [{ vehicle_type: Number(key) }, { seat_type: Number(key) }, { seats: Number(key) }])
          ]
        }))
      }

      const result = await databaseService.vehicles
        .find(searchQuery)
        .project({ preview: 0 })
        .sort({ created_at: -1 })
        .skip(payload.current)
        .limit(next)
        .toArray()

      const continued = result.length > limit

      const vehicle = result.slice(0, limit)

      const current = payload.current + vehicle.length

      if (vehicle.length === 0) {
        return {
          message: VEHICLE_MESSGAE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          vehicle
        }
      }
    } else {
      const keywords = payload.keywords.split(' ')

      const searchQuery = {
        user: user._id,
        $and: [
          {
            $or: keywords.map((key) => ({
              $or: [
                { rules: { $regex: key, $options: 'i' } },
                { amenities: { $regex: key, $options: 'i' } },
                { license_plate: { $regex: key, $options: 'i' } },
                ...(isNaN(Number(key))
                  ? []
                  : [{ vehicle_type: Number(key) }, { seat_type: Number(key) }, { seats: Number(key) }])
              ]
            }))
          }
        ]
      }

      const result = await databaseService.vehicles
        .find(searchQuery)
        .project({ preview: 0 })
        .sort({ created_at: -1 })
        .skip(payload.current)
        .limit(next)
        .toArray()

      const continued = result.length > limit

      const vehicle = result.slice(0, limit)

      const current = payload.current + vehicle.length

      if (vehicle.length === 0) {
        return {
          message: VEHICLE_MESSGAE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          vehicle
        }
      }
    }
  }

  async censorVehicle(payload: CensorVehicleRequestBody, vehicle: Vehicle) {
    const decision = payload.decision
    let status: VehicleStatus
    let email_subject: string
    let email_html: string
    if (decision) {
      status = VehicleStatus.ACCEPTED
      email_subject = `Thông báo phê duyệt phương tiện - ${process.env.TRADEMARK_NAME}`
      email_html = `
        <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0044cc; color: #fff; text-align: center; padding: 20px;">
                  <h1 style="margin: 0; font-size: 24px;">${process.env.TRADEMARK_NAME}</h1>
              </div>
              <div style="padding: 20px;">
                  <p style="font-size: 16px; line-height: 1.5;">
                      Kính gửi Quý doanh nghiệp,
                  </p>
                  <p style="font-size: 16px; line-height: 1.5;">
                      Chúng tôi rất vui mừng thông báo rằng phương tiện quý doanh nghiệp đã đăng ký với ${process.env.TRADEMARK_NAME} đã được <strong>chấp thuận</strong> thành công.
                  </p>
                  <h2 style="font-size: 18px; margin-top: 20px;">Thông tin phương tiện:</h2>
                  <ul style="font-size: 16px; line-height: 1.6; padding-left: 20px;">
                      <li><strong>Loại phương tiện:</strong> ${vehicle.vehicle_type == VehicleTypeEnum.BUS ? 'Xe khách' : vehicle.vehicle_type == VehicleTypeEnum.TRAIN ? 'Tàu hỏa' : vehicle.vehicle_type == VehicleTypeEnum.PLANE ? 'Máy bay' : 'Không xác định'}</li>
                      <li><strong>Loại ghế:</strong> ${vehicle.seat_type == SeatType.SEATING_SEAT ? 'Ghế ngồi' : vehicle.seat_type == SeatType.SLEEPER_SEAT ? 'Giường nằm' : vehicle.seat_type == SeatType.HYBRID_SEAT ? 'Ghế vừa nằm vừa ngồi' : 'Không xác định'}</li>
                      <li><strong>Số ghế:</strong> ${vehicle.seats}</li>
                      <li><strong>Số hiệu:</strong> ${vehicle.license_plate}</li>
                      <li><strong>Ngày đăng ký:</strong> ${this.getFormatDate(vehicle.created_at)}</li>
                  </ul>
                  <p style="font-size: 16px; line-height: 1.5;">
                      Chúng tôi rất mong được hợp tác lâu dài cùng quý doanh nghiệp để mang đến dịch vụ tốt nhất cho khách hàng.
                  </p>
                  <p style="font-size: 16px; line-height: 1.5;">
                      Trân trọng,
                  </p>
                  <p style="font-size: 16px; line-height: 1.5;"><strong>Đội ngũ ${process.env.TRADEMARK_NAME}</strong></p>
              </div>
              <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 14px; color: #666;">
                  © ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Mọi quyền được bảo lưu.
              </div>
          </div>
      </div>
      `
    } else {
      status = VehicleStatus.DENIED
      email_subject = `Thông báo từ chối phương tiện - ${process.env.TRADEMARK_NAME}`
      email_html = `
        <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
            <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #cc0000; color: #fff; text-align: center; padding: 20px;">
                    <h1 style="margin: 0; font-size: 24px;">${process.env.TRADEMARK_NAME}</h1>
                </div>
                <div style="padding: 20px;">
                    <p style="font-size: 16px; line-height: 1.5;">
                        Kính gửi Quý doanh nghiệp,
                    </p>
                    <p style="font-size: 16px; line-height: 1.5;">
                        Chúng tôi rất tiếc phải thông báo rằng phương tiện quý doanh nghiệp đã đăng ký với ${process.env.TRADEMARK_NAME} <strong>không được chấp thuận</strong> tại thời điểm này.
                    </p>
                    <h2 style="font-size: 18px; margin-top: 20px;">Thông tin phương tiện:</h2>
                    <ul style="font-size: 16px; line-height: 1.6; padding-left: 20px;">
                        <li><strong>Loại phương tiện:</strong> ${vehicle.vehicle_type == VehicleTypeEnum.BUS ? 'Xe khách' : vehicle.vehicle_type == VehicleTypeEnum.TRAIN ? 'Tàu hỏa' : vehicle.vehicle_type == VehicleTypeEnum.PLANE ? 'Máy bay' : 'Không xác định'}</li>
                        <li><strong>Loại ghế:</strong> ${vehicle.seat_type == SeatType.SEATING_SEAT ? 'Ghế ngồi' : vehicle.seat_type == SeatType.SLEEPER_SEAT ? 'Giường nằm' : vehicle.seat_type == SeatType.HYBRID_SEAT ? 'Ghế vừa nằm vừa ngồi' : 'Không xác định'}</li>
                        <li><strong>Số ghế:</strong> ${vehicle.seats}</li>
                        <li><strong>Số hiệu:</strong> ${vehicle.license_plate}</li>
                        <li><strong>Ngày đăng ký:</strong> ${this.getFormatDate(vehicle.created_at)}</li>
                    </ul>
                    <p style="font-size: 16px; line-height: 1.5;">
                        Lý do từ chối có thể bao gồm việc không đáp ứng các tiêu chí của chúng tôi hoặc thiếu thông tin cần thiết trong quá trình đăng ký. Quý doanh nghiệp có thể liên hệ với chúng tôi để biết thêm chi tiết hoặc nộp lại yêu cầu sau khi hoàn thiện thông tin.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5;">
                        Chúng tôi hy vọng sẽ có cơ hội hợp tác cùng quý doanh nghiệp trong tương lai.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5;">
                        Trân trọng,
                    </p>
                    <p style="font-size: 16px; line-height: 1.5;"><strong>Đội ngũ ${process.env.TRADEMARK_NAME}</strong></p>
                </div>
                <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 14px; color: #666;">
                    © ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Mọi quyền được bảo lưu.
                </div>
            </div>
        </div>
      `
    }

    const user = await databaseService.users.findOne({ _id: vehicle.user })

    if (user === null) {
      throw new ErrorWithStatus({
        message: VEHICLE_MESSGAE.USER_NOT_FOUND,
        status: HTTPSTATUS.NOT_FOUND
      })
    }

    await Promise.all([
      databaseService.vehicles.updateOne(
        {
          _id: new ObjectId(vehicle._id)
        },
        {
          $set: { status: status },
          $currentDate: { updated_at: true }
        }
      ),
      sendMail(user.email, email_subject, email_html)
    ])
  }

  private getFormatDate(date: Date): string {
    const formatDate = new Date(date)
    const day = String(formatDate.getDate()).padStart(2, '0')
    const month = String(formatDate.getMonth() + 1).padStart(2, '0')
    const year = formatDate.getFullYear()

    return `${day}/${month}/${year}`
  }

  async getVehicleList(user: User) {
    if (user.permission == UserPermission.ADMINISTRATOR) {
      const vehicle = await databaseService.vehicles
        .find({})
        .project({ license_plate: 1, _id: 1 })
        .sort({ created_at: -1 })
        .toArray()

      if (vehicle.length === 0) {
        return {
          message: VEHICLE_MESSGAE.NO_MATCHING_RESULTS_FOUND,
          vehicle: []
        }
      } else {
        return {
          vehicle
        }
      }
    } else {
      const vehicle = await databaseService.vehicles
        .find({ user: user._id })
        .project({ license_plate: 1, _id: 1 })
        .sort({ created_at: -1 })
        .toArray()

      if (vehicle.length === 0) {
        return {
          message: VEHICLE_MESSGAE.NO_MATCHING_RESULTS_FOUND,
          vehicle: []
        }
      } else {
        return {
          vehicle
        }
      }
    }
  }
}
const vehicleService = new VehicleService()
export default vehicleService
