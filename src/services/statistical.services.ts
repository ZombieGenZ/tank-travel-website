import { UserPermission } from '~/constants/enum'
import User from '~/models/schemas/users.schemas'
import databaseService from './database.services'
import { FindStatisticsRequestBody } from '~/models/requests/statistical.requests'

class StatisticalService {
  async getRevenueStatistics(user: User) {
    const date = new Date()
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    if (user.permission === UserPermission.ADMINISTRATOR) {
      let totalPrice = 0

      const todayBills = await databaseService.bill
        .find({
          booking_time: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        })
        .toArray()

      for (const bill of todayBills) {
        totalPrice += bill.totalPrice
      }
      const tax = (totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
      const totalRevenue = totalPrice - tax

      return totalRevenue
    } else {
      let totalPrice = 0

      const todayBills = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: startOfDay,
                $lte: endOfDay
              }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route_info'
            }
          },
          {
            $unwind: '$bus_route_info'
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'bus_route_info.vehicle',
              foreignField: '_id',
              as: 'vehicle_info'
            }
          },
          {
            $unwind: '$vehicle_info'
          },
          {
            $match: {
              'vehicle_info.user': user._id
            }
          }
        ])
        .toArray()

      for (const bill of todayBills) {
        totalPrice += bill.totalPrice
      }

      const tax = (totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
      const totalRevenue = totalPrice - tax

      return totalRevenue
    }
  }

  async findRevenueStatistics(payload: FindStatisticsRequestBody, user: User) {
    const startOfDay = new Date(payload.start_time)
    const endOfDay = new Date(payload.end_time)

    if (user.permission === UserPermission.ADMINISTRATOR) {
      let totalPrice = 0

      const todayBills = await databaseService.bill
        .find({
          booking_time: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        })
        .toArray()

      for (const bill of todayBills) {
        totalPrice += bill.totalPrice
      }
      const tax = (totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
      const totalRevenue = totalPrice - tax

      return totalRevenue
    } else {
      let totalPrice = 0

      const todayBills = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: startOfDay,
                $lte: endOfDay
              }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route_info'
            }
          },
          {
            $unwind: '$bus_route_info'
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'bus_route_info.vehicle',
              foreignField: '_id',
              as: 'vehicle_info'
            }
          },
          {
            $unwind: '$vehicle_info'
          },
          {
            $match: {
              'vehicle_info.user': user._id
            }
          }
        ])
        .toArray()

      for (const bill of todayBills) {
        totalPrice += bill.totalPrice
      }

      const tax = (totalPrice / 100) * Number(process.env.REVENUE_TAX as string)
      const totalRevenue = totalPrice - tax

      return totalRevenue
    }
  }

  async getOrderStatistics(user: User) {
    const date = new Date()
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    if (user.permission === UserPermission.ADMINISTRATOR) {
      let totalOrder = 0

      const todayBills = await databaseService.bill
        .find({
          booking_time: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        })
        .toArray()

      for (const bill of todayBills) {
        totalOrder += bill.quantity
      }

      return totalOrder
    } else {
      let totalOrder = 0

      const todayBills = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: startOfDay,
                $lte: endOfDay
              }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route_info'
            }
          },
          {
            $unwind: '$bus_route_info'
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'bus_route_info.vehicle',
              foreignField: '_id',
              as: 'vehicle_info'
            }
          },
          {
            $unwind: '$vehicle_info'
          },
          {
            $match: {
              'vehicle_info.user': user._id
            }
          }
        ])
        .toArray()

      for (const bill of todayBills) {
        totalOrder += bill.quantity
      }

      return totalOrder
    }
  }

  async findOrderStatistics(payload: FindStatisticsRequestBody, user: User) {
    const startOfDay = new Date(payload.start_time)
    const endOfDay = new Date(payload.end_time)

    if (user.permission === UserPermission.ADMINISTRATOR) {
      let totalOrder = 0

      const todayBills = await databaseService.bill
        .find({
          booking_time: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        })
        .toArray()

      for (const bill of todayBills) {
        totalOrder += bill.quantity
      }

      return totalOrder
    } else {
      let totalOrder = 0

      const todayBills = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: startOfDay,
                $lte: endOfDay
              }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route_info'
            }
          },
          {
            $unwind: '$bus_route_info'
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'bus_route_info.vehicle',
              foreignField: '_id',
              as: 'vehicle_info'
            }
          },
          {
            $unwind: '$vehicle_info'
          },
          {
            $match: {
              'vehicle_info.user': user._id
            }
          }
        ])
        .toArray()

      for (const bill of todayBills) {
        totalOrder += bill.quantity
      }

      return totalOrder
    }
  }

  async getDealStatistics(user: User) {
    const date = new Date()
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    if (user.permission === UserPermission.ADMINISTRATOR) {
      let totalDeal = 0

      const todayBills = await databaseService.bill
        .find({
          booking_time: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        })
        .toArray()

      for (const bill of todayBills) {
        totalDeal++
      }

      return totalDeal
    } else {
      let totalDeal = 0

      const todayBills = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: startOfDay,
                $lte: endOfDay
              }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route_info'
            }
          },
          {
            $unwind: '$bus_route_info'
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'bus_route_info.vehicle',
              foreignField: '_id',
              as: 'vehicle_info'
            }
          },
          {
            $unwind: '$vehicle_info'
          },
          {
            $match: {
              'vehicle_info.user': user._id
            }
          }
        ])
        .toArray()

      for (const bill of todayBills) {
        totalDeal++
      }

      return totalDeal
    }
  }

  async findDealStatistics(payload: FindStatisticsRequestBody, user: User) {
    const startOfDay = new Date(payload.start_time)
    const endOfDay = new Date(payload.end_time)

    if (user.permission === UserPermission.ADMINISTRATOR) {
      let totalDeal = 0

      const todayBills = await databaseService.bill
        .find({
          booking_time: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        })
        .toArray()

      for (const bill of todayBills) {
        totalDeal++
      }

      return totalDeal
    } else {
      let totalDeal = 0

      const todayBills = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: startOfDay,
                $lte: endOfDay
              }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
              localField: 'bus_route',
              foreignField: '_id',
              as: 'bus_route_info'
            }
          },
          {
            $unwind: '$bus_route_info'
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'bus_route_info.vehicle',
              foreignField: '_id',
              as: 'vehicle_info'
            }
          },
          {
            $unwind: '$vehicle_info'
          },
          {
            $match: {
              'vehicle_info.user': user._id
            }
          }
        ])
        .toArray()

      for (const bill of todayBills) {
        totalDeal++
      }

      return totalDeal
    }
  }
}

const statisticsService = new StatisticalService()
export default statisticsService
