import { ObjectId } from 'mongodb'
import { OrderRequestBody } from '~/models/requests/order.requests'
import { Bill } from '~/models/schemas/bill.schemas'
import databaseService from './database.services'
import { BusRoute } from '~/models/schemas/busRoute.schemas'
import { sendMail } from '~/utils/mail'
import User from '~/models/schemas/users.schemas'
import { SeatType, VehicleTypeEnum } from '~/constants/enum'
import { Vehicle } from '~/models/schemas/vehicle.chemas'

class OrderService {
  async order(payload: OrderRequestBody, user: User, busRoute: BusRoute) {
    const date = new Date()
    const vehicle = (await databaseService.vehicles.findOne({ _id: busRoute.vehicle })) as Vehicle
    const authorVehicle = (await databaseService.users.findOne({ _id: vehicle.user })) as User
    const totalPrice = payload.quantity * busRoute.price
    const totalRevenue = ((busRoute.price * payload.quantity) / 100) * Number(process.env.REVENUE_TAX as string)
    const orders: Bill[] = []

    for (let i = 0; i < payload.quantity; i++) {
      const order = new Bill({
        ...payload,
        bus_route: new ObjectId(payload.bus_route_id),
        user: user._id,
        booking_time: date,
        price: busRoute.price
      })
      orders.push(order)
    }

    const email_subject = `Vé điện từ - ${process.env.TRADEMARK_NAME}`
    const email_html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <h2 style="text-align: center; color: #333;">Vé Điện Tử - ${process.env.TRADEMARK_NAME}</h2>
              <p>Xin chào <strong>${payload.name}</strong>,</p>
              <p>Chúng tôi xin gửi đến bạn thông tin vé xe của chuyến đi sắp tới:</p>
              <table style="margin-top: 20px; border-collapse: collapse; width: 100%;">
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Loại phương tiện</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${vehicle.vehicle_type == VehicleTypeEnum.BUS ? 'Xe khách' : vehicle.vehicle_type == VehicleTypeEnum.TRAIN ? 'Tàu hỏa' : vehicle.vehicle_type == VehicleTypeEnum.PLANE ? 'Máy bay' : 'Không xác định'}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Loại chỗ ngồi</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${vehicle.seat_type == SeatType.SEATING_SEAT ? 'Ghế ngồi' : vehicle.seat_type == SeatType.SLEEPER_SEAT ? 'Giường nằm' : vehicle.seat_type == SeatType.HYBRID_SEAT ? 'Ghế vừa nằm vừa ngồi' : 'Không xác định'}</td>
                  </tr>
                                    <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Số ghế</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${payload.quantity}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Số hiệu</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${vehicle.license_plate}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Nơi khởi hành</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${busRoute.start_point}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Thời gian khởi hành</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${this.getFormatDate(busRoute.departure_time)}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Nơi đến</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${busRoute.end_point}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Thời gian đến dự kiến</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${this.getFormatDate(busRoute.arrival_time)}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Thời gian đặt vé</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${this.getFormatDate(date)}</td>
                  </tr>
              </table>
              <p><strong>Quy định trên xe:</strong></p>
              <p>${vehicle.rules}</p>
              <p>Cảm ơn bạn đã sử dụng dịch vụ của <strong>${process.env.TRADEMARK_NAME}</strong>. Chúc bạn có một chuyến đi an toàn và thuận lợi!</p>
              <p style="margin-top: 20px; text-align: center; font-size: 14px; color: #555;">Hotline hỗ trợ: <a href="tel:${process.env.SUPPORT_PHONE}">${process.env.SUPPORT_PHONE_DISPLAY}</a> | Website: <a href="${process.env.APP_URL}">${process.env.APP_URL_DISPLAY}</a></p>
          </div>
      </div>
    `

    const bill_email_subject = `Hóa đơn đặt vé xe ${busRoute.start_point} - ${busRoute.end_point} - ${process.env.TRADEMARK_NAME}`
    const bill_email_html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <h2 style="text-align: center; color: #333;">Hóa Đơn Đặt Vé - ${process.env.TRADEMARK_NAME}</h2>
              <p>Xin chào <strong>${payload.name}</strong>,</p>
              <p>Cảm ơn bạn đã đặt vé tại <strong>${process.env.TRADEMARK_NAME}</strong>. Dưới đây là thông tin hóa đơn của bạn:</p>
              <table style="margin-top: 20px; border-collapse: collapse; width: 100%;">
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Thời gian đặt</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${this.getFormatDate(date)}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Tuyến</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${busRoute.start_point} -  ${busRoute.end_point}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Số lượng</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${payload.quantity} vé</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Giá vé</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${busRoute.price.toLocaleString('vi-VN')} vnđ</td>
                  </tr>
              </table>
              <p style="margin-top: 20px;">Tổng tiền: <strong>${totalPrice.toLocaleString('vi-VN')} vnđ</strong></p>
              <p>Cảm ơn bạn đã sử dụng dịch vụ của <strong>${process.env.TRADEMARK_NAME}</strong>. Chúc bạn có một chuyến đi an toàn và thuận lợi!</p>
              <p style="margin-top: 20px; text-align: center; font-size: 14px; color: #555;">Hotline hỗ trợ: <a href="tel:${process.env.SUPPORT_PHONE}">${process.env.SUPPORT_PHONE_DISPLAY}</a> | Website: <a href="${process.env.APP_URL}">${process.env.APP_URL_DISPLAY}</a></p>
          </div>
      </div>
    `

    await Promise.all([
      databaseService.order.insertMany(orders),
      databaseService.busRoute.updateOne(
        { _id: new ObjectId(payload.bus_route_id) },
        {
          $set: {
            quantity: busRoute.quantity - payload.quantity,
            sold: busRoute.sold + payload.quantity
          },
          $currentDate: { updated_at: true }
        }
      ),
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            balance: user.balance - totalPrice
          }
        }
      ),
      databaseService.users.updateOne(
        {
          _id: vehicle.user
        },
        {
          $set: {
            revenue: authorVehicle.revenue + totalRevenue
          }
        }
      ),
      sendMail(user.email, email_subject, email_html),
      sendMail(user.email, bill_email_subject, bill_email_html)
    ])
  }

  private getFormatDate(date: Date): string {
    const formatDate = new Date(date)
    const minute = String(formatDate.getMinutes()).padStart(2, '0')
    const hour = String(formatDate.getHours()).padStart(2, '0')
    const day = String(formatDate.getDate()).padStart(2, '0')
    const month = String(formatDate.getMonth() + 1).padStart(2, '0')
    const year = formatDate.getFullYear()

    return `${hour}:${minute} ${day}/${month}/${year}`
  }
}

const orderService = new OrderService()
export default orderService
