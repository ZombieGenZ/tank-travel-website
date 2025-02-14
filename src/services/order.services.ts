import { ObjectId } from 'mongodb'
import { OrderRequestBody, GetOrderRequestBody, GetOrderDetailRequestBody } from '~/models/requests/order.requests'
import BillDetail from '~/models/schemas/billDetail.schemas'
import databaseService from './database.services'
import BusRoute from '~/models/schemas/busRoute.schemas'
import { sendMail } from '~/utils/mail'
import User from '~/models/schemas/users.schemas'
import { SeatType, TicketStatus, UserPermission, VehicleTypeEnum } from '~/constants/enum'
import Vehicle from '~/models/schemas/vehicle.chemas'
import Bill from '~/models/schemas/bill.schemas'
import Profit from '~/models/schemas/profit.schemas'
import { ORDER_MESSAGE } from '~/constants/message'
import { db } from '~/services/firebase.services'
import { io } from '~/index'
import NotificationPrivateService from './notificationPrivate.services'
import { formatDateNotSecond } from '~/utils/date'

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

    const billUrl = `${process.env.APP_URL}/order/bill?id=${bill.insertedId}`

    const email_subject = `Vé điện từ - ${process.env.TRADEMARK_NAME}`
    const email_html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <h2 style="text-align: center; color: #333;">Vé Điện Tử - ${process.env.TRADEMARK_NAME}</h2>
              
              <div style="text-align: center; margin: 20px 0;">
                  <img src="cid:ticket-qr"
                      alt="QR Code Vé ${vehicle.vehicle_type == VehicleTypeEnum.BUS ? 'xe khách' : vehicle.vehicle_type == VehicleTypeEnum.TRAIN ? 'tàu hỏa' : vehicle.vehicle_type == VehicleTypeEnum.PLANE ? 'máy bay' : 'Không xác định'} tuyến ${busRoute.start_point} - ${busRoute.end_point}" 
                      style="width: 150px; height: 150px;"
                  />
                  <p style="margin: 10px 0; font-size: 14px; color: #666;">Sử dụng QR Code này để xuất trình vé của bạn</p>
              </div>
              
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
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${formatDateNotSecond(busRoute.departure_time)}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Nơi đến</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${busRoute.end_point}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Thời gian đến dự kiến</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${formatDateNotSecond(busRoute.arrival_time)}</td>
                  </tr>
                  <tr>
                      <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Thời gian đặt vé</th>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${formatDateNotSecond(date)}</td>
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
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${formatDateNotSecond(date)}</td>
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
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: left;">${busRoute.price.toLocaleString('vi-VN')} đ</td>
                  </tr>
              </table>
              <p style="margin-top: 20px;">Tổng tiền: <strong>${totalPrice.toLocaleString('vi-VN')} đ</strong></p>
              <p>Cảm ơn bạn đã sử dụng dịch vụ của <strong>${process.env.TRADEMARK_NAME}</strong>. Chúc bạn có một chuyến đi an toàn và thuận lợi!</p>
              <p style="margin-top: 20px; text-align: center; font-size: 14px; color: #555;">Hotline hỗ trợ: <a href="tel:${process.env.SUPPORT_PHONE}">${process.env.SUPPORT_PHONE_DISPLAY}</a> | Website: <a href="${process.env.APP_URL}">${process.env.APP_URL_DISPLAY}</a></p>
          </div>
      </div>
    `

    const balanceFirebaseRealtime = db.ref(`balance/${user._id}`).push()
    const revenueFirebaseRealtime = db.ref(`revenue/${vehicle.user}`).push()

    const revenueStatisticseFirebaseRealtime = db.ref(`statistics/revenue/${vehicle.user}`).push()
    const orderStatisticseFirebaseRealtime = db.ref(`statistics/order/${vehicle.user}`).push()
    const dealStatisticseFirebaseRealtime = db.ref(`statistics/deal/${vehicle.user}`).push()

    const notificationMessageCustomer = `-${totalPrice.toLocaleString('vi-VN')} đ thanh toán mua ${payload.quantity} vé xe ${busRoute.start_point} - ${busRoute.end_point}`
    const notificationMessageBusiness = `+${totalRevenue.toLocaleString('vi-VN')} đ khách hàng thanh toán mua ${payload.quantity} vé xe ${busRoute.start_point} - ${busRoute.end_point}`

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
      sendMail(user.email, email_subject, email_html, billUrl),
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
      ),
      balanceFirebaseRealtime.set({
        type: '-',
        value: totalPrice
      }),
      io.to(`user-${user._id}`).emit('update-balance', {
        type: '-',
        value: totalPrice
      }),
      revenueFirebaseRealtime.set({
        type: '+',
        value: totalRevenue
      }),
      io.to(`user-${vehicle.user}`).emit('update-revenue', {
        type: '+',
        value: totalRevenue
      }),
      NotificationPrivateService.createNotification(user._id, notificationMessageCustomer),
      NotificationPrivateService.createNotification(authorVehicle._id, notificationMessageBusiness),
      revenueStatisticseFirebaseRealtime.set({
        type: '+',
        value: totalRevenue,
        time: date
      }),
      io.to(`statistics-${vehicle.user}`).emit('update-statistics-revenue', {
        type: '+',
        value: totalRevenue,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-revenue-global', {
        type: '+',
        value: totalRevenue,
        time: date
      }),
      orderStatisticseFirebaseRealtime.set({
        type: '+',
        value: payload.quantity,
        time: date
      }),
      io.to(`statistics-${vehicle.user}`).emit('update-statistics-order', {
        type: '+',
        value: payload.quantity,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-order-global', {
        type: '+',
        value: payload.quantity,
        time: date
      }),
      dealStatisticseFirebaseRealtime.set({
        type: '+',
        value: 1,
        time: date
      }),
      io.to(`statistics-${vehicle.user}`).emit('update-statistics-deal', {
        type: '+',
        value: 1,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-deal-global', {
        type: '+',
        value: 1,
        time: date
      })
    ])
  }

  async getOrderList(payload: GetOrderRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const result = await databaseService.bill
      .aggregate([
        {
          $match: {
            user: user._id,
            booking_time: { $lt: new Date(payload.session_time) }
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
            localField: 'bus_route',
            foreignField: '_id',
            as: 'bus_route'
          }
        },
        {
          $unwind: '$bus_route'
        },
        {
          $project: {
            'bus_route.quantity': 0,
            'bus_route.sold': 0,
            'bus_route.created_at': 0,
            'bus_route.updated_at': 0
          }
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
            from: process.env.DATABASE_BILL_COLLECTION,
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
            from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
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
            $match: {
              booking_time: { $lt: new Date(payload.session_time) }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route'
            }
          },
          {
            $unwind: '$bus_route'
          },
          {
            $project: {
              'bus_route.quantity': 0,
              'bus_route.sold': 0,
              'bus_route.created_at': 0,
              'bus_route.updated_at': 0
            }
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
            $match: {
              booking_time: { $lt: new Date(payload.session_time) }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route'
            }
          },
          {
            $unwind: '$bus_route'
          },
          {
            $project: {
              'bus_route.quantity': 0,
              'bus_route.sold': 0,
              'bus_route.created_at': 0,
              'bus_route.updated_at': 0
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
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

  async cancelTicketDetail(user: User, billDetail: BillDetail) {
    const date = new Date()
    const bill = (await databaseService.bill.findOne({ _id: billDetail.bill })) as Bill
    const busRoute = (await databaseService.busRoute.findOne({ _id: bill.bus_route })) as BusRoute
    const authorVehicle = await databaseService.vehicles
      .aggregate<User>([
        {
          $lookup: {
            from: process.env.DATABASE_USER_COLLECTION,
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $match: {
            _id: busRoute.vehicle
          }
        },
        {
          $replaceRoot: { newRoot: '$user' }
        }
      ])
      .toArray()
      .then((users) => users[0])
    const booking_time = new Date(bill.booking_time)
    const profit = (await databaseService.profit.findOne({
      time: `${booking_time.getFullYear()}-${String(booking_time.getMonth() + 1).padStart(2, '0')}`
    })) as Profit

    const departure_time = new Date(busRoute.departure_time)
    const diffInMs = departure_time.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)

    let refundPercent: number

    if (diffInHours > 24) {
      refundPercent = 80
    } else if (diffInHours >= 12 && diffInHours <= 24) {
      refundPercent = 50
    } else if (diffInHours >= 4 && diffInHours <= 12) {
      refundPercent = 20
    } else {
      refundPercent = 0
    }

    // số tiền refund về cho người dùng
    const refund = (billDetail.price / 100) * refundPercent

    // doanh thu của doanh nghiệp
    const oldRevenue = billDetail.price - (billDetail.price / 100) * Number(process.env.REVENUE_TAX as string)
    const newRevenue =
      billDetail.price - refund - ((billDetail.price - refund) / 100) * Number(process.env.REVENUE_TAX as string)

    // lợi nhuận của công ty
    const oldProfit = (billDetail.price / 100) * Number(process.env.REVENUE_TAX as string)
    const newProfit = ((billDetail.price - refund) / 100) * Number(process.env.REVENUE_TAX as string)

    const totalPrice = bill.totalPrice - billDetail.price
    const totalQuantity = bill.quantity - 1

    const balanceFirebaseRealtime = db.ref(`balance/${user._id}`).push()
    const revenueFirebaseRealtime = db.ref(`revenue/${user._id}`).push()

    const notificationMessageCustomer = `+${refund.toLocaleString('vi-VN')} đ hoàn tiền cho vé xe ${busRoute.start_point} - ${busRoute.end_point}`
    const notificationMessageBusiness1 = `-${oldRevenue.toLocaleString('vi-VN')} đ khách hũy vé xe ${busRoute.start_point} - ${busRoute.end_point}`
    const notificationMessageBusiness2 = `+${newRevenue.toLocaleString('vi-VN')} đ phí đền bù hũy vé hũy vé xe ${busRoute.start_point} - ${busRoute.end_point}`

    const revenueStatisticseFirebaseRealtime = db.ref(`statistics/revenue/${authorVehicle._id}`).push()
    const orderStatisticseFirebaseRealtime = db.ref(`statistics/order/${authorVehicle._id}`).push()
    const dealStatisticseFirebaseRealtime = db.ref(`statistics/deal/${authorVehicle._id}`).push()

    Promise.all([
      databaseService.billDetail.updateOne(
        {
          _id: billDetail._id
        },
        {
          $set: {
            status: TicketStatus.CANCELLED,
            cancellation_time: date
          }
        }
      ),
      databaseService.profit.updateOne(
        {
          time: `${booking_time.getFullYear()}-${String(booking_time.getMonth() + 1).padStart(2, '0')}`
        },
        {
          $set: {
            revenue: profit.revenue - oldProfit + newProfit
          },
          $currentDate: {
            last_update: true
          }
        }
      ),
      databaseService.users.updateOne(
        {
          _id: authorVehicle._id
        },
        {
          $set: {
            revenue: authorVehicle.revenue - oldRevenue + newRevenue
          }
        }
      ),
      databaseService.bill.updateOne(
        {
          _id: bill._id
        },
        {
          $set: {
            totalPrice: totalPrice,
            quantity: totalQuantity
          }
        }
      ),
      databaseService.busRoute.updateOne(
        {
          _id: busRoute._id
        },
        {
          $set: {
            quantity: busRoute.quantity + 1,
            sold: busRoute.sold - 1
          }
        }
      ),
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            balance: user.balance + refund
          }
        }
      ),
      balanceFirebaseRealtime.set({
        type: '+',
        value: refund
      }),
      io.to(`user-${user._id}`).emit('update-balance', {
        type: '+',
        value: refund
      }),
      revenueFirebaseRealtime.set({
        type: '-',
        value: oldRevenue
      }),
      io.to(`user-${authorVehicle._id}`).emit('update-revenue', {
        type: '-',
        value: oldRevenue
      }),
      revenueFirebaseRealtime.set({
        type: '+',
        value: newRevenue
      }),
      io.to(`user-${authorVehicle._id}`).emit('update-revenue', {
        type: '+',
        value: newRevenue
      }),
      NotificationPrivateService.createNotification(user._id, notificationMessageCustomer),
      NotificationPrivateService.createNotification(authorVehicle._id, notificationMessageBusiness1),
      NotificationPrivateService.createNotification(authorVehicle._id, notificationMessageBusiness2),
      revenueStatisticseFirebaseRealtime.set({
        type: '-',
        value: oldRevenue,
        time: date
      }),
      io.to(`statistics-${authorVehicle._id}`).emit('update-statistics-revenue', {
        type: '-',
        value: oldRevenue,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-revenue-global', {
        type: '-',
        value: oldRevenue,
        time: date
      }),
      revenueStatisticseFirebaseRealtime.set({
        type: '+',
        value: newRevenue,
        time: date
      }),
      io.to(`statistics-${authorVehicle._id}`).emit('update-statistics-revenue', {
        type: '+',
        value: newRevenue,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-revenue-global', {
        type: '+',
        value: newRevenue,
        time: date
      }),
      orderStatisticseFirebaseRealtime.set({
        type: '-',
        value: 1,
        time: date
      }),
      io.to(`statistics-${authorVehicle._id}`).emit('update-statistics-order', {
        type: '-',
        value: 1,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-order-global', {
        type: '-',
        value: totalQuantity == 0 ? 1 : 0,
        time: date
      }),
      dealStatisticseFirebaseRealtime.set({
        type: '-',
        value: 1,
        time: date
      }),
      io.to(`statistics-${authorVehicle._id}`).emit('update-statistics-deal', {
        type: '-',
        value: totalQuantity == 0 ? 1 : 0,
        time: date
      }),
      io.to(`statistics-global`).emit('update-statistics-deal-global', {
        type: '-',
        value: totalQuantity == 0 ? 1 : 0,
        time: date
      })
    ])
  }
}

const orderService = new OrderService()
export default orderService
