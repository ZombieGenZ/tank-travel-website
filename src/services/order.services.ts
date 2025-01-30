import { ObjectId } from 'mongodb'
import { OrderRequestBody, GetOrderRequestBody, GetOrderDetailRequestBody } from '~/models/requests/order.requests'
import { BillDetail } from '~/models/schemas/billDetail.schemas'
import databaseService from './database.services'
import { BusRoute } from '~/models/schemas/busRoute.schemas'
import { sendMail } from '~/utils/mail'
import User from '~/models/schemas/users.schemas'
import { SeatType, UserPermission, VehicleTypeEnum } from '~/constants/enum'
import { Vehicle } from '~/models/schemas/vehicle.chemas'
import { Bill } from '~/models/schemas/bill.schemas'
import { Profit } from '~/models/schemas/profit.schemas'
import { ORDER_MESSAGE } from '~/constants/message'

class OrderService {
  async order(payload: OrderRequestBody, user: User, busRoute: BusRoute) {
    const date = new Date()
    const vehicle = (await databaseService.vehicles.findOne({ _id: busRoute.vehicle })) as Vehicle
    const authorVehicle = (await databaseService.users.findOne({ _id: vehicle.user })) as User
    const totalPrice = payload.quantity * busRoute.price
    const totalRevenue =
      payload.quantity * busRoute.price -
      ((busRoute.price * payload.quantity) / 100) * Number(process.env.REVENUE_TAX as string)
    let profit = await databaseService.profit.findOne({
      time: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    })
    const revenue = ((busRoute.price * payload.quantity) / 100) * Number(process.env.REVENUE_TAX as string)

    if (profit === null) {
      const result = await databaseService.profit.insertOne(new Profit({}))
      profit = await databaseService.profit.findOne({ _id: result.insertedId })
    }

    const bill = await databaseService.bill.insertOne(
      new Bill({
        ...payload,
        bus_route: new ObjectId(payload.bus_route_id),
        user: user._id,
        booking_time: date,
        totalPrice: totalPrice
      })
    )

    const billDetails: BillDetail[] = []

    for (let i = 0; i < payload.quantity; i++) {
      const billDetail = new BillDetail({
        ...payload,
        bill: bill.insertedId,
        price: busRoute.price
      })
      billDetails.push(billDetail)
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
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${payload.quantity} ghế</td>
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
      databaseService.billDetail.insertMany(billDetails),
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
      sendMail(user.email, bill_email_subject, bill_email_html),
      databaseService.profit.updateOne(
        {
          _id: (profit as Profit)._id
        },
        {
          $set: {
            revenue: (profit as Profit).revenue + revenue
          },
          $currentDate: { last_update: true }
        }
      )
    ])
  }

  async getOrderList(payload: GetOrderRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const result = await databaseService.bill
      .aggregate([
        {
          $match: {
            user: user._id
          }
        },
        {
          $lookup: {
            from: 'bus_routes',
            localField: 'bus_route',
            foreignField: '_id',
            as: 'bus_route'
          }
        },
        {
          $unwind: '$bus_route'
        },
        {
          $sort: {
            booking_time: -1
          }
        },
        {
          $skip: payload.current
        },
        {
          $limit: next
        }
      ])
      .toArray()

    const continued = result.length > limit

    const bill = result.slice(0, limit)

    const current = payload.current + bill.length

    if (bill.length === 0) {
      return {
        message: ORDER_MESSAGE.NO_MATCHING_RESULTS_FOUND,
        current: payload.current,
        continued: false,
        vehicle: []
      }
    } else {
      return {
        current,
        continued,
        bill
      }
    }
  }

  async getOrderDetailList(payload: GetOrderDetailRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const result = await databaseService.billDetail
      .aggregate([
        {
          $lookup: {
            from: 'bill',
            localField: 'bill',
            foreignField: '_id',
            as: 'bill_info'
          }
        },
        {
          $unwind: '$bill_info'
        },
        {
          $lookup: {
            from: 'bus_routes',
            localField: 'bill_info.bus_route',
            foreignField: '_id',
            as: 'bus_route'
          }
        },
        {
          $unwind: '$bus_route'
        },
        {
          $match: { 'bill_info.user': user._id }
        },
        {
          $project: {
            bill_info: 0
          }
        },
        {
          $sort: { created_at: -1 }
        },
        {
          $skip: payload.current
        },
        {
          $limit: next
        }
      ])
      .toArray()

    const continued = result.length > limit

    const bill = result.slice(0, limit)

    const current = payload.current + bill.length

    if (bill.length === 0) {
      return {
        message: ORDER_MESSAGE.NO_MATCHING_RESULTS_FOUND,
        current: payload.current,
        continued: false,
        vehicle: []
      }
    } else {
      return {
        current,
        continued,
        bill
      }
    }
  }

  async getOrder(payload: GetOrderRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const result = await databaseService.bill
        .aggregate([
          {
            $lookup: {
              from: 'bus_routes',
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route'
            }
          },
          {
            $unwind: '$bus_route'
          },
          {
            $sort: {
              booking_time: -1
            }
          },
          {
            $skip: payload.current
          },
          {
            $limit: next
          }
        ])
        .toArray()

      const continued = result.length > limit

      const bill = result.slice(0, limit)

      const current = payload.current + bill.length

      if (bill.length === 0) {
        return {
          message: ORDER_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          bill
        }
      }
    } else {
      const result = await databaseService.bill
        .aggregate([
          {
            $lookup: {
              from: 'bus_routes',
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route'
            }
          },
          {
            $unwind: '$bus_route'
          },
          {
            $lookup: {
              from: 'vehicles',
              localField: 'bus_route.vehicle',
              foreignField: '_id',
              as: 'vehicle_info'
            }
          },
          {
            $unwind: '$vehicle_info'
          },
          {
            $match: {
              $or: [
                {
                  'vehicle_info.user': user._id
                }
              ]
            }
          },
          {
            $project: {
              vehicle_info: 0
            }
          },
          {
            $sort: { booking_time: -1 }
          },
          {
            $skip: payload.current
          },
          {
            $limit: next
          }
        ])
        .toArray()

      const continued = result.length > limit

      const bill = result.slice(0, limit)

      const current = payload.current + bill.length

      if (bill.length === 0) {
        return {
          message: ORDER_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          bill
        }
      }
    }
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
