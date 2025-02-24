import {
  CreateBusRouteRequestBody,
  UpdateBusRouteRequestBody,
  GetBusRouteRequestBody,
  FindBusRouteRequestBody,
  GetBusRouteListRequestBody,
  FindBusRouteListRequestBody
} from '~/models/requests/busRoute.requests'
import databaseService from './database.services'
import BusRoute from '~/models/schemas/busRoute.schemas'
import { ObjectId } from 'mongodb'
import { UserPermission, VehicleStatus } from '~/constants/enum'
import User from '~/models/schemas/users.schemas'
import { BUSROUTE_MESSAGE } from '~/constants/message'
import { createRegexPattern } from '~/utils/regex'
import Vehicle from '~/models/schemas/vehicle.chemas'
import NotificationPrivateService from './notificationPrivate.services'
import { formatDateNotSecond } from '~/utils/date'
import { sendMail } from '~/utils/mail'
import { db } from './firebase.services'
import { io } from '~/index'

class BusRouteService {
  async createBusRoute(payload: CreateBusRouteRequestBody) {
    await databaseService.busRoute.insertOne(
      new BusRoute({
        ...payload,
        vehicle: new ObjectId(payload.vehicle_id)
      })
    )
  }

  async updateBusRoute(payload: UpdateBusRouteRequestBody) {
    databaseService.busRoute.updateOne(
      {
        _id: new ObjectId(payload.bus_route_id)
      },
      {
        $set: {
          vehicle: new ObjectId(payload.vehicle_id),
          start_point: payload.start_point,
          end_point: payload.end_point,
          departure_time: payload.departure_time,
          arrival_time: payload.arrival_time,
          price: payload.price,
          quantity: payload.quantity
        },
        $currentDate: { updated_at: true }
      }
    )
  }

  async deleteBusRoute(busRoute: BusRoute) {
    const date = new Date()
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

    const vehicle = (await databaseService.vehicles.findOne({ _id: busRoute.vehicle })) as Vehicle
    const authorVehicle = (await databaseService.users.findOne({ _id: vehicle.user })) as User
    const totalTex = (totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
    const totalRevenue = totalPrice - totalTex
    const revenueMessage = `-${totalRevenue} đ do tuyến ${busRoute.start_point} - ${busRoute.end_point} đã bị hủy`

    const revenueStatisticseFirebaseRealtime = db.ref(`statistics/revenue/${authorVehicle._id}`).push()
    const orderStatisticseFirebaseRealtime = db.ref(`statistics/order/${authorVehicle._id}`).push()
    const dealStatisticseFirebaseRealtime = db.ref(`statistics/deal/${authorVehicle._id}`).push()

    await Promise.all([
      ...profitPromises,
      ...balancePromises,
      databaseService.busRoute.deleteOne({ _id: busRoute._id }),
      databaseService.users.updateOne(
        {
          _id: vehicle.user
        },
        {
          $set: {
            revenue: authorVehicle.revenue - totalRevenue
          }
        }
      ),
      NotificationPrivateService.createNotification(vehicle.user, revenueMessage),
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

  async getBusRoute(payload: GetBusRouteRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const result = await databaseService.busRoute
        .aggregate([
          {
            $match: {
              created_at: { $lt: new Date(payload.session_time) }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'vehicle',
              foreignField: '_id',
              as: 'vehicle'
            }
          },
          {
            $unwind: {
              path: '$vehicle',
              preserveNullAndEmptyArrays: false
            }
          },
          {
            $project: {
              'vehicle.preview': 0
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

      const busRoute = result.slice(0, limit)

      const current = payload.current + busRoute.length

      if (busRoute.length === 0) {
        return {
          message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          busRoute: []
        }
      } else {
        return {
          current,
          continued,
          busRoute
        }
      }
    } else {
      const result = await databaseService.busRoute
        .aggregate([
          {
            $match: {
              created_at: { $lt: new Date(payload.session_time) }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'vehicle',
              foreignField: '_id',
              as: 'vehicle'
            }
          },
          {
            $unwind: {
              path: '$vehicle',
              preserveNullAndEmptyArrays: false
            }
          },
          {
            $match: { 'vehicle.user': user._id }
          },
          {
            $project: {
              'vehicle.preview': 0
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

      const busRoute = result.slice(0, limit)

      const current = payload.current + busRoute.length

      if (busRoute.length === 0) {
        return {
          message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          busRoute: []
        }
      } else {
        return {
          current,
          continued,
          busRoute
        }
      }
    }
  }

  async findBusRoute(payload: FindBusRouteRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const keywords = payload.keywords.split(' ')

      // const searchQuery = {
      //   $and: [
      //     {
      //       $or: keywords.map((key) => ({
      //         $or: [
      //           { start_point: { $regex: key, $options: 'i' } },
      //           { end_point: { $regex: key, $options: 'i' } },
      //           ...(isNaN(Number(key)) ? [] : [{ price: Number(key) }, { quantity: Number(key) }])
      //         ]
      //       }))
      //     },
      //     { created_at: { $lt: new Date(payload.session_time) } }
      //   ]
      // }

      const pipeline = [
        {
          $match: {
            created_at: { $lt: new Date(payload.session_time) }
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_VEHICLE_COLLECTION,
            localField: 'vehicle',
            foreignField: '_id',
            as: 'vehicle'
          }
        },
        {
          $unwind: {
            path: '$vehicle',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $match: {
            $or: keywords.map((key) => ({
              $or: [
                { start_point: { $regex: key, $options: 'i' } },
                { end_point: { $regex: key, $options: 'i' } },
                ...(isNaN(Number(key)) ? [] : [{ price: Number(key) }, { quantity: Number(key) }])
              ]
            }))
          }
        },
        {
          $project: {
            'vehicle.preview': 0
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
      ]

      const result = await databaseService.busRoute.aggregate(pipeline).toArray()

      const continued = result.length > limit

      const busRoute = result.slice(0, limit)

      const current = payload.current + busRoute.length

      if (busRoute.length === 0) {
        return {
          message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          busRoute: []
        }
      } else {
        return {
          current,
          continued,
          busRoute
        }
      }
    } else {
      const keywords = payload.keywords.split(' ')

      const pipeline = [
        {
          $match: {
            created_at: { $lt: new Date(payload.session_time) }
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_VEHICLE_COLLECTION,
            localField: 'vehicle',
            foreignField: '_id',
            as: 'vehicle'
          }
        },
        {
          $unwind: {
            path: '$vehicle',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $match: {
            'vehicle.user': user._id,
            $or: keywords.map((key) => ({
              $or: [
                { start_point: { $regex: key, $options: 'i' } },
                { end_point: { $regex: key, $options: 'i' } },
                ...(isNaN(Number(key)) ? [] : [{ price: Number(key) }, { quantity: Number(key) }])
              ]
            }))
          }
        },
        {
          $project: {
            'vehicle.preview': 0
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
      ]

      const result = await databaseService.busRoute.aggregate(pipeline).toArray()

      const continued = result.length > limit

      const busRoute = result.slice(0, limit)

      const current = payload.current + busRoute.length

      if (busRoute.length === 0) {
        return {
          message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          busRoute: []
        }
      } else {
        return {
          current,
          continued,
          busRoute
        }
      }
    }
  }

  async getBusRouteList(payload: GetBusRouteListRequestBody) {
    const date = new Date()
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const result = await databaseService.busRoute
      .aggregate([
        {
          $match: {
            created_at: { $lt: new Date(payload.session_time) },
            quantity: { $gt: 0 }
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_VEHICLE_COLLECTION,
            localField: 'vehicle',
            foreignField: '_id',
            as: 'vehicle'
          }
        },
        {
          $unwind: '$vehicle'
        },
        {
          $match: {
            'vehicle.status': VehicleStatus.ACCEPTED
          }
        },
        {
          $addFields: {
            departure_time_date: { $toDate: '$departure_time' }
          }
        },
        {
          $addFields: {
            time_difference: {
              $abs: {
                $subtract: ['$departure_time_date', date]
              }
            }
          }
        },
        {
          $sort: { time_difference: 1 }
        },
        {
          $skip: payload.current
        },
        {
          $limit: next
        },
        {
          $project: {
            time_difference: 0,
            'vehicle.license_plate': 0
          }
        }
      ])
      .toArray()

    const continued = result.length > limit

    const busRoute = result.slice(0, limit)

    const current = payload.current + busRoute.length

    if (busRoute.length === 0) {
      return {
        message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
        current: payload.current,
        continued: false,
        vehicle: []
      }
    } else {
      return {
        current,
        continued,
        busRoute
      }
    }
  }

  async findBusRouteList(payload: FindBusRouteListRequestBody) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const searchDate = new Date(payload.departure_time)
    const day = searchDate.getDate()
    const month = searchDate.getMonth() + 1
    const year = searchDate.getFullYear()

    const searchQuery = {
      start_point: {
        $regex: createRegexPattern(payload.start_point),
        $options: 'i'
      },
      end_point: {
        $regex: createRegexPattern(payload.end_point),
        $options: 'i'
      },
      quantity: { $gt: 0 },
      departure_time: {
        $gte: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00.000Z`,
        $lt: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T23:59:59.999Z`
      },
      created_at: { $lt: new Date(payload.session_time) }
    }

    const result = await databaseService.busRoute
      .aggregate([
        {
          $match: searchQuery
        },
        {
          $lookup: {
            from: process.env.DATABASE_VEHICLE_COLLECTION,
            localField: 'vehicle',
            foreignField: '_id',
            as: 'vehicle'
          }
        },
        {
          $unwind: '$vehicle'
        },
        {
          $match: {
            'vehicle.status': VehicleStatus.ACCEPTED,
            'vehicle.vehicle_type': payload.vehicle_type.toString()
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
        },
        {
          $project: {
            'vehicle.license_plate': 0
          }
        }
      ])
      .toArray()

    const continued = result.length > limit

    const busRoute = result.slice(0, limit)

    const current = payload.current + busRoute.length

    if (busRoute.length === 0) {
      return {
        message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
        current: payload.current,
        continued: false,
        vehicle: []
      }
    } else {
      return {
        current,
        continued,
        busRoute
      }
    }
  }
}

const busRouteService = new BusRouteService()
export default busRouteService
