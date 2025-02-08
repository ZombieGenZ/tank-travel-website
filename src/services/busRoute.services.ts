import {
  CreateBusRouteRequestBody,
  UpdateBusRouteRequestBody,
  GetBusRouteRequestBody,
  FindBusRouteRequestBody,
  FindBusRouteListRequestBody
} from '~/models/requests/busRoute.requests'
import databaseService from './database.services'
import BusRoute from '~/models/schemas/busRoute.schemas'
import { ObjectId } from 'mongodb'
import { UserPermission } from '~/constants/enum'
import User from '~/models/schemas/users.schemas'
import { BUSROUTE_MESSAGE } from '~/constants/message'
import { createRegexPattern } from '~/utils/regex'
import Bill from '~/models/schemas/bill.schemas'
import Profit from '~/models/schemas/profit.schemas'
import Vehicle from '~/models/schemas/vehicle.chemas'

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
    // DOITAFTER Làm thêm chức năng hoàn tiền nếu vé đã được đặt mà xóa phương tiện

    interface ITotalProfitObject {
      time: string
      totalRevenue: number
    }
    interface ITotalRefundObject {
      user_id: ObjectId
      totalBalance: number
    }
    const totalProfitObject: ITotalProfitObject[] = []
    const totalRefundObject: ITotalRefundObject[] = []
    let totalPrice = 0

    if (busRoute.arrival_time < new Date()) {
      const bills = await databaseService.bill.find({ busRoute: busRoute._id }).toArray()

      bills.forEach(async (bill: Bill) => {
        const date = new Date(bill.booking_time)
        const time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

        const existingRefundItem = totalRefundObject.find((item) => item.user_id === bill.user)
        if (existingRefundItem) {
          existingRefundItem.totalBalance += bill.totalPrice
        } else {
          totalRefundObject.push({
            user_id: bill.user,
            totalBalance: bill.totalPrice
          })
        }

        const existingProfitItem = totalProfitObject.find((item) => item.time === time)
        if (existingProfitItem) {
          existingProfitItem.totalRevenue += (totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
        } else {
          totalProfitObject.push({
            time: time,
            totalRevenue: (totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
          })
        }

        totalPrice += bill.totalPrice

        await Promise.all([
          await databaseService.bill.deleteOne({ _id: bill._id }),
          await databaseService.billDetail.deleteMany({ bill: bill._id })
        ])
      })
    } else {
      const bills = await databaseService.bill.find({ busRoute: busRoute._id }).toArray()

      bills.forEach(async (bill: Bill) => {
        await Promise.all([
          await databaseService.bill.deleteOne({ _id: bill._id }),
          await databaseService.billDetail.deleteMany({ bill: bill._id })
        ])
      })
    }

    const promisesProfit = [] as Promise<void>[]

    totalProfitObject.forEach(async (item) => {
      promisesProfit.push(
        new Promise((resolve, reject) => {
          const handleProfit = async () => {
            try {
              const profit = (await databaseService.profit.findOne({ time: item.time })) as Profit

              await databaseService.profit.updateOne(
                {
                  time: item.time
                },
                {
                  $set: {
                    revenue: profit.revenue - item.totalRevenue
                  },
                  $currentDate: {
                    last_update: true
                  }
                }
              )

              resolve()
            } catch (error) {
              reject(error)
            }
          }

          handleProfit()
        })
      )
    })

    const promisesBalance = [] as Promise<void>[]

    totalRefundObject.forEach(async (item) => {
      promisesBalance.push(
        new Promise((resolve, reject) => {
          const handleProfit = async () => {
            try {
              const user = (await databaseService.users.findOne({ _id: item.user_id })) as User

              await databaseService.users.updateOne(
                {
                  _id: item.user_id
                },
                {
                  $set: {
                    balance: user.balance + item.totalBalance
                  }
                }
              )

              resolve()
            } catch (error) {
              reject(error)
            }
          }

          handleProfit()
        })
      )
    })

    const vehicle = (await databaseService.vehicles.findOne({ _id: busRoute.vehicle })) as Vehicle
    const authorVehicle = (await databaseService.users.findOne({ _id: vehicle.user })) as User
    const totalProfit = (totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
    const totalRevenue = totalPrice - totalProfit

    await Promise.all([
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
      databaseService.vehicles.deleteOne({ _id: new ObjectId(vehicle._id) }),
      Promise.all(promisesProfit),
      Promise.all(promisesBalance)
    ])
  }

  async getBusRoute(payload: GetBusRouteRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const result = await databaseService.busRoute
        .find({})
        .sort({ created_at: -1 })
        .skip(payload.current)
        .limit(next)
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
    } else {
      const result = await databaseService.busRoute
        .aggregate([
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'vehicle',
              foreignField: '_id',
              as: 'vehicle_info'
            }
          },
          {
            $unwind: {
              path: '$vehicle_info',
              preserveNullAndEmptyArrays: false
            }
          },
          {
            $match: { 'vehicle_info.user': user._id }
          },
          {
            $project: {
              vehicle_info: 0
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

  async findBusRoute(payload: FindBusRouteRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const keywords = payload.keywords.split(' ')

      const searchQuery = {
        $or: keywords.map((key) => ({
          $or: [
            { start_point: { $regex: key, $options: 'i' } },
            { end_point: { $regex: key, $options: 'i' } },

            ...(isNaN(Number(key)) ? [] : [{ price: Number(key) }, { quantity: Number(key) }])
          ]
        }))
      }

      const result = await databaseService.busRoute
        .find(searchQuery)
        .sort({ created_at: -1 })
        .skip(payload.current)
        .limit(next)
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
    } else {
      const keywords = payload.keywords.split(' ')

      const pipeline = [
        {
          $lookup: {
            from: process.env.DATABASE_VEHICLE_COLLECTION,
            localField: 'vehicle',
            foreignField: '_id',
            as: 'vehicle_info'
          }
        },
        {
          $unwind: {
            path: '$vehicle_info',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $match: {
            'vehicle_info.user': user._id,
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
            vehicle_info: 0
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
      $expr: {
        $and: [
          { $eq: [{ $toInt: { $substr: ['$departure_time', 8, 2] } }, day] },
          { $eq: [{ $toInt: { $substr: ['$departure_time', 5, 2] } }, month] },
          { $eq: [{ $toInt: { $substr: ['$departure_time', 0, 4] } }, year] }
        ]
      }
    }
    const result = await databaseService.busRoute
      .find(searchQuery)
      .sort({ created_at: -1 })
      .skip(payload.current)
      .limit(next)
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
