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
import NotificationPrivateService from './notificationPrivate.services'
import { formatDateNotSecond } from '~/utils/date'
import { db } from './firebase.services'
import { io } from '~/index'

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
    const date = new Date()
    const previewPromises = vehicle.preview.map(
      (file) =>
        new Promise<void>((resolve, reject) => {
          try {
            fs.unlinkSync(file.path)
            resolve()
          } catch (err) {
            reject(err)
          }
        })
    )

    interface ITotalProfitObject {
      time: string
      totalRevenue: number
    }
    interface ITotalRefundObject {
      user_id: ObjectId
      totalBalance: number
      message: string
      start_point: string
      end_point: string
      departure_time: Date
      user: User
    }

    const totalProfitObject: ITotalProfitObject[] = []
    const totalRefundObject: ITotalRefundObject[] = []
    let totalPrice = 0
    let totalQuantityRemove = 0
    let totalDealRemove = 0

    const busRoutes = await databaseService.busRoute.find({ vehicle: vehicle._id }).toArray()

    for (const busRoute of busRoutes) {
      const bills = await databaseService.bill.find({ bus_route: busRoute._id }).toArray()

      for (const bill of bills) {
        if (new Date(busRoute.arrival_time) > new Date()) {
          const user = (await databaseService.users.findOne({ _id: bill.user })) as User
          const date = new Date(bill.booking_time)
          const time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

          const existingRefundItem = totalRefundObject.find((item) => item.user_id.equals(bill.user))
          if (existingRefundItem) {
            existingRefundItem.totalBalance += bill.totalPrice
          } else {
            totalRefundObject.push({
              user_id: bill.user,
              totalBalance: bill.totalPrice,
              message: `+${bill.totalPrice.toLocaleString('vi-VN')} đ hoàn tiền chuyến đi ${busRoute.start_point} - ${busRoute.end_point} vào lúc ${formatDateNotSecond(busRoute.departure_time)} do doanh nghiệp đã hũy chuyến đi`,
              start_point: busRoute.start_point,
              end_point: busRoute.end_point,
              departure_time: busRoute.departure_time,
              user: user
            })
          }

          const existingProfitItem = totalProfitObject.find((item) => item.time === time)
          if (existingProfitItem) {
            existingProfitItem.totalRevenue += (bill.totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
          } else {
            totalProfitObject.push({
              time: time,
              totalRevenue: (bill.totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
            })
          }

          totalPrice += bill.totalPrice
        }

        totalQuantityRemove += bill.quantity
        totalDealRemove++

        await Promise.all([
          databaseService.bill.deleteOne({ _id: bill._id }),
          databaseService.billDetail.deleteMany({ bill: bill._id })
        ])
      }

      await databaseService.busRoute.deleteOne({ _id: busRoute._id })
    }

    const profitPromises = totalProfitObject.map(async (item) => {
      await databaseService.profit.updateOne(
        { time: item.time },
        {
          $inc: {
            revenue: item.totalRevenue
          },
          $currentDate: {
            last_update: true
          }
        }
      )
    })

    const balancePromises = totalRefundObject.map(async (item) => {
      const email_subject = `Thông Báo Hủy Tuyến ${item.start_point} - ${item.end_point} vào lúc ${formatDateNotSecond(item.departure_time)} - ${process.env.TRADEMARK_NAME}`
      const email_html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #333; margin-bottom: 10px;">${process.env.TRADEMARK_NAME}</h1>
                    <h2 style="color: #e74c3c;">Thông Báo Hủy Tuyến</h2>
                </div>                  

                <div style="color: #333; line-height: 1.6;">
                    <p>Kính chào Quý Khách,</p>
                    
                    <p style="margin-bottom: 15px;">Chúng tôi xin thông báo rằng tuyến <strong>${item.start_point} - ${item.end_point}</strong> của Quý Khách đã bị <strong style="color: #e74c3c;">HỦY</strong>.</p>
                    
                    <div style="background-color: #f9f9f9; border-left: 4px solid #e74c3c; padding: 10px; margin: 15px 0;">
                        <p style="margin: 0;"><strong>Chi Tiết Tuyến Xe Bị Hủy:</strong></p>
                        <ul style="margin: 10px 0 0 20px; padding: 0;">
                            <li>Điểm Khởi Hành: ${item.start_point}</li>
                            <li>Điểm Dừng: ${item.end_point}</li>
                            <li>Thời Gian Khởi Hành: ${formatDateNotSecond(item.departure_time)}</li>
                        </ul>
                    </div>
                    
                    <p>Để biết thêm chi tiết về việc hủy tuyến xe và các phương án thay thế, vui lòng truy cập <a href="${process.env.APP_URL}" style="color: #3498db; text-decoration: none;">website ${process.env.TRADEMARK_NAME}</a>.</p>
                    
                    <p>Chúng tôi xin lỗi vì sự bất tiện này và rất mong được phục vụ Quý Khách.</p>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <p style="color: #7f8c8d; font-size: 0.9em;">Trân trọng,<br>Đội Ngũ ${process.env.TRADEMARK_NAME}</p>
                    </div>
                </div>
            </div>
        </div>
      `

      Promise.all([
        sendMail(item.user.email, email_subject, email_html),
        NotificationPrivateService.createNotification(item.user_id, item.message),
        databaseService.users.updateOne(
          { _id: item.user_id },
          {
            $inc: {
              balance: item.totalBalance
            }
          }
        )
      ])
    })

    const authorVehicle = (await databaseService.users.findOne({ _id: vehicle.user })) as User
    const totalTex = (totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
    const totalRevenue = totalPrice - totalTex

    const revenueMessage = `-${totalRevenue.toLocaleString('vi-VN')} đ do phương tiện ${vehicle.license_plate} đã bị hủy`

    const revenueStatisticseFirebaseRealtime = db.ref(`statistics/revenue/${authorVehicle._id}`).push()
    const orderStatisticseFirebaseRealtime = db.ref(`statistics/order/${authorVehicle._id}`).push()
    const dealStatisticseFirebaseRealtime = db.ref(`statistics/deal/${authorVehicle._id}`).push()

    await Promise.all([
      ...previewPromises,
      ...profitPromises,
      ...balancePromises,
      databaseService.users.updateOne(
        { _id: vehicle.user },
        {
          $set: {
            revenue: authorVehicle.revenue - totalRevenue
          }
        }
      ),
      databaseService.vehicles.deleteOne({ _id: new ObjectId(vehicle._id) }),
      NotificationPrivateService.createNotification(vehicle.user, revenueMessage),
      databaseService.evaluate.deleteMany({ vehicle: vehicle._id }),
      revenueStatisticseFirebaseRealtime.set({
        type: '-',
        value: totalRevenue,
        time: date
      }),
      io.to(`statistics-${authorVehicle._id}`).emit('update-statistics-revenue', {
        type: '-',
        value: totalRevenue,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-revenue-global', {
        type: '-',
        value: totalRevenue,
        time: date
      }),
      orderStatisticseFirebaseRealtime.set({
        type: '-',
        value: totalQuantityRemove,
        time: date
      }),
      io.to(`statistics-${authorVehicle._id}`).emit('update-statistics-order', {
        type: '-',
        value: totalQuantityRemove,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-order-global', {
        type: '-',
        value: totalQuantityRemove,
        time: date
      }),
      dealStatisticseFirebaseRealtime.set({
        type: '-',
        value: totalDealRemove,
        time: date
      }),
      io.to(`statistics-${authorVehicle._id}`).emit('update-statistics-deal', {
        type: '-',
        value: totalDealRemove,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-deal-global', {
        type: '-',
        value: totalDealRemove,
        time: date
      })
    ])
  }

  async getVehicle(payload: GetVehicleRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const result = await databaseService.vehicles
        .find({ created_at: { $lt: new Date(payload.session_time) } })
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
        .find({
          user: user._id,
          created_at: { $lt: new Date(payload.session_time) }
        })
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
          },
          { created_at: { $lt: new Date(payload.session_time) } }
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
          },
          { created_at: { $lt: new Date(payload.session_time) } }
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
    const user = await databaseService.users.findOne({ _id: vehicle.user })

    if (user === null) {
      throw new ErrorWithStatus({
        message: VEHICLE_MESSGAE.USER_NOT_FOUND,
        status: HTTPSTATUS.NOT_FOUND
      })
    }

    const decision = payload.decision
    let status: VehicleStatus
    let email_subject: string
    let email_html: string
    let notificationMessage: string
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
      notificationMessage = `Chào ${user.display_name}! Chúng tôi rất vui mừng thông báo rằng phương tiện của bạn đã được ${process.env.TRADEMARK_NAME} kiểm duyệt và chấp thuận thành công. Giờ đây, bạn đã có thể bắt đầu hành trình kết nối với hàng ngàn khách hàng tiềm năng trên khắp cả nước.`
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

      notificationMessage = `Chào ${user.display_name}! Cảm ơn bạn đã tin tưởng và lựa chọn ${process.env.TRADEMARK_NAME}. Tuy nhiên, sau quá trình xem xét, chúng tôi rất tiếc phải thông báo rằng phương tiện của bạn chưa đạt yêu cầu để tham gia vào nền tảng của chúng tôi.`
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
      sendMail(user.email, email_subject, email_html),
      NotificationPrivateService.createNotification(user._id, notificationMessage)
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
