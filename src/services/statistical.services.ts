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

  async getTopRevenueStatistics() {
    const today: Date = new Date()
    const sevenDaysAgo: Date = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)

    today.setHours(23, 59, 59, 999)
    sevenDaysAgo.setHours(0, 0, 0, 0)

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
          $lookup: {
            from: process.env.DATABASE_USER_COLLECTION,
            localField: 'vehicle_info.user',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        {
          $unwind: '$user_info'
        },
        {
          $addFields: {
            discountedPrice: {
              $multiply: ['$totalPrice', 0.95]
            }
          }
        },
        {
          $group: {
            _id: '$vehicle_info.user',
            totalRevenue: { $sum: '$discountedPrice' },
            user: { $first: '$user_info' }
          }
        },
        {
          $project: {
            _id: 0,
            userId: '$_id',
            totalRevenue: 1,
            display_name: '$user.display_name',
            email: '$user.email',
            phone: '$user.phone',
            user_type: '$user.user_type',
            balance: '$user.balance',
            revenue: '$user.revenue',
            permission: '$user.permission',
            avatar: '$user.avatar',
            temporary: '$user.temporary',
            penalty: '$user.penalty',
            created_at: '$user.created_at',
            updated_at: '$user.updated_at'
          }
        },
        {
          $sort: { totalRevenue: -1 }
        },
        {
          $limit: 5
        }
      ])
      .toArray()

    return result
  }

  async getCompareDealsStatistics(user: User) {
    const today: Date = new Date()
    const yesterday: Date = new Date()
    yesterday.setDate(today.getDate() - 1)

    const todayStart: Date = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd: Date = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const yesterdayStart: Date = new Date(yesterday)
    yesterdayStart.setHours(0, 0, 0, 0)
    const yesterdayEnd: Date = new Date(yesterday)
    yesterdayEnd.setHours(23, 59, 59, 999)

    let todayCount = 0
    let yesterdayCount = 0

    if (user.permission === UserPermission.ADMINISTRATOR) {
      const todayDealsCount = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: todayStart,
                $lte: todayEnd
              }
            }
          },
          {
            $count: 'count'
          }
        ])
        .toArray()

      const yesterdayDealsCount = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
              }
            }
          },
          {
            $count: 'count'
          }
        ])
        .toArray()

      todayCount = todayDealsCount.length > 0 ? todayDealsCount[0].count : 0
      yesterdayCount = yesterdayDealsCount.length > 0 ? yesterdayDealsCount[0].count : 0
    } else {
      const todayDealsCount = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: todayStart,
                $lte: todayEnd
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
            $count: 'count'
          }
        ])
        .toArray()

      const yesterdayDealsCount = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
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
            $count: 'count'
          }
        ])
        .toArray()

      todayCount = todayDealsCount.length > 0 ? todayDealsCount[0].count : 0
      yesterdayCount = yesterdayDealsCount.length > 0 ? yesterdayDealsCount[0].count : 0
    }

    let percentChange = 0

    if (yesterdayCount === 0) {
      percentChange = todayCount > 0 ? 100 : 0
    } else {
      percentChange = Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)
    }

    return percentChange
  }

  async getCompareRevenueStatistics(user: User) {
    const today: Date = new Date()
    const yesterday: Date = new Date()
    yesterday.setDate(today.getDate() - 1)

    const todayStart: Date = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd: Date = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const yesterdayStart: Date = new Date(yesterday)
    yesterdayStart.setHours(0, 0, 0, 0)
    const yesterdayEnd: Date = new Date(yesterday)
    yesterdayEnd.setHours(23, 59, 59, 999)

    let todayRevenue = 0
    let yesterdayRevenue = 0

    if (user.permission === UserPermission.ADMINISTRATOR) {
      const todayRevenueData = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: todayStart,
                $lte: todayEnd
              }
            }
          },
          {
            $addFields: {
              discountedPrice: {
                $multiply: ['$totalPrice', 0.95]
              }
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$discountedPrice' }
            }
          }
        ])
        .toArray()

      const yesterdayRevenueData = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
              }
            }
          },
          {
            $addFields: {
              discountedPrice: {
                $multiply: ['$totalPrice', 0.95]
              }
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$discountedPrice' }
            }
          }
        ])
        .toArray()

      todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].totalRevenue : 0
      yesterdayRevenue = yesterdayRevenueData.length > 0 ? yesterdayRevenueData[0].totalRevenue : 0
    } else {
      const todayRevenueData = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: todayStart,
                $lte: todayEnd
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
              discountedPrice: {
                $multiply: ['$totalPrice', 0.95]
              }
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$discountedPrice' }
            }
          }
        ])
        .toArray()

      const yesterdayRevenueData = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
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
              discountedPrice: {
                $multiply: ['$totalPrice', 0.95]
              }
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$discountedPrice' }
            }
          }
        ])
        .toArray()

      todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].totalRevenue : 0
      yesterdayRevenue = yesterdayRevenueData.length > 0 ? yesterdayRevenueData[0].totalRevenue : 0
    }

    let percentChange = 0

    if (yesterdayRevenue === 0) {
      percentChange = todayRevenue > 0 ? 100 : 0
    } else {
      percentChange = Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    }

    return percentChange
  }
  async getCompareTicketStatistics(user: User) {
    const today: Date = new Date()
    const yesterday: Date = new Date()
    yesterday.setDate(today.getDate() - 1)

    const todayStart: Date = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd: Date = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const yesterdayStart: Date = new Date(yesterday)
    yesterdayStart.setHours(0, 0, 0, 0)
    const yesterdayEnd: Date = new Date(yesterday)
    yesterdayEnd.setHours(23, 59, 59, 999)

    let todayQuantity = 0
    let yesterdayQuantity = 0

    if (user.permission === UserPermission.ADMINISTRATOR) {
      const todayQuantityData = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: todayStart,
                $lte: todayEnd
              }
            }
          },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$quantity' }
            }
          }
        ])
        .toArray()

      const yesterdayQuantityData = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
              }
            }
          },
          {
            $group: {
              _id: null,
              totalQuantity: { $sum: '$quantity' }
            }
          }
        ])
        .toArray()

      todayQuantity = todayQuantityData.length > 0 ? todayQuantityData[0].totalQuantity : 0
      yesterdayQuantity = yesterdayQuantityData.length > 0 ? yesterdayQuantityData[0].totalQuantity : 0
    } else {
      const todayQuantityData = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: todayStart,
                $lte: todayEnd
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
            $group: {
              _id: null,
              totalQuantity: { $sum: '$quantity' }
            }
          }
        ])
        .toArray()

      const yesterdayQuantityData = await databaseService.bill
        .aggregate([
          {
            $match: {
              booking_time: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
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
            $group: {
              _id: null,
              totalQuantity: { $sum: '$quantity' }
            }
          }
        ])
        .toArray()

      todayQuantity = todayQuantityData.length > 0 ? todayQuantityData[0].totalQuantity : 0
      yesterdayQuantity = yesterdayQuantityData.length > 0 ? yesterdayQuantityData[0].totalQuantity : 0
    }

    let percentChange = 0

    if (yesterdayQuantity === 0) {
      percentChange = todayQuantity > 0 ? 100 : 0
    } else {
      percentChange = Math.round(((todayQuantity - yesterdayQuantity) / yesterdayQuantity) * 100)
    }

    return percentChange
  }
}

const statisticsService = new StatisticalService()
export default statisticsService
