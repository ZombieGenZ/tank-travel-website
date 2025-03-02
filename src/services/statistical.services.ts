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

  async getChartRevenueStatistics(user: User) {
    const today: Date = new Date()
    const sevenDaysAgo: Date = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)

    today.setHours(23, 59, 59, 999)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const allDates: Array<{ date: Date; dateString: string; formattedDate: string }> = []
    for (let i = 0; i <= 7; i++) {
      const date: Date = new Date(sevenDaysAgo)
      date.setDate(sevenDaysAgo.getDate() + i)

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const formattedDate = `${day}/${month}`

      allDates.push({
        date: date,
        dateString: date.toISOString().split('T')[0],
        formattedDate: formattedDate
      })
    }

    if (user.permission === UserPermission.ADMINISTRATOR) {
      // ADMIN sees all revenue data
      const result = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: sevenDaysAgo,
                $lte: today
              }
            }
          },
          {
            $addFields: {
              dateOnly: {
                $dateToString: { format: '%Y-%m-%d', date: '$booking_time' }
              },
              discountedPrice: {
                $multiply: ['$totalPrice', 0.95]
              }
            }
          },
          {
            $group: {
              _id: '$dateOnly',
              totalRevenue: { $sum: '$discountedPrice' }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ])
        .toArray()

      const resultMap: Record<string, number> = {}
      result.forEach((item: any) => {
        resultMap[item._id] = item.totalRevenue
      })

      const finalResult = allDates.map((dateObj) => {
        return {
          date: dateObj.formattedDate,
          totalRevenue: resultMap[dateObj.dateString] || 0
        }
      })

      return finalResult
    } else {
      const result = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: sevenDaysAgo,
                $lte: today
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
          },
          {
            $addFields: {
              dateOnly: {
                $dateToString: { format: '%Y-%m-%d', date: '$booking_time' }
              },
              discountedPrice: {
                $multiply: ['$totalPrice', 0.95]
              }
            }
          },
          {
            $group: {
              _id: '$dateOnly',
              totalRevenue: { $sum: '$discountedPrice' }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ])
        .toArray()

      const resultMap: Record<string, number> = {}
      result.forEach((item: any) => {
        resultMap[item._id] = item.totalRevenue
      })

      const finalResult = allDates.map((dateObj) => {
        return {
          date: dateObj.formattedDate,
          totalRevenue: resultMap[dateObj.dateString] || 0
        }
      })

      return finalResult
    }
  }
}

const statisticsService = new StatisticalService()
export default statisticsService
