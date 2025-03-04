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
    today.setHours(23, 59, 59, 999)

    const timezoneOffset = today.getTimezoneOffset()

    const sevenDaysAgo: Date = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const isDifferentDay = timezoneOffset / 60 > 0

    const allDates: Array<{ date: Date; dateString: string; formattedDate: string }> = []
    const tempDate = new Date(sevenDaysAgo)

    while (tempDate <= today) {
      const day = String(tempDate.getDate()).padStart(2, '0')
      const month = String(tempDate.getMonth() + 1).padStart(2, '0')
      const formattedDate = `${day}/${month}`

      const utcDate = new Date(Date.UTC(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 0, 0, 0, 0))
      const dateString = utcDate.toISOString().split('T')[0]

      allDates.push({
        date: new Date(tempDate),
        dateString: dateString,
        formattedDate: formattedDate
      })

      tempDate.setDate(tempDate.getDate() + 1)
    }

    let result
    if (user.permission === UserPermission.ADMINISTRATOR) {
      result = await databaseService.bill
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
                $dateToString: { format: '%Y-%m-%d', date: '$booking_time', timezone: 'UTC' }
              },
              discountedPrice: {
                $multiply: ['$totalPrice', 0.95]
              }
            }
          },
          {
            $group: {
              _id: '$dateOnly',
              totalRevenue: { $sum: '$discountedPrice' },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ])
        .toArray()
    } else {
      result = await databaseService.bill
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
                $dateToString: { format: '%Y-%m-%d', date: '$booking_time', timezone: 'UTC' }
              },
              discountedPrice: {
                $multiply: ['$totalPrice', 0.95]
              }
            }
          },
          {
            $group: {
              _id: '$dateOnly',
              totalRevenue: { $sum: '$discountedPrice' },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ])
        .toArray()
    }

    const resultMap: Record<string, number> = {}
    result.forEach((item: any) => {
      resultMap[item._id] = item.totalRevenue
    })

    const finalResult = allDates.map((dateObj) => {
      const revenue = resultMap[dateObj.dateString] || 0

      return {
        date: dateObj.formattedDate,
        totalRevenue: revenue
      }
    })

    return finalResult
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

  async getTodayStatistics(user: User) {
    const today: Date = new Date()
    const todayStart: Date = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd: Date = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    let todayDeals = 0
    let todayTickets = 0
    let todayRevenue = 0

    const matchCondition: any = {
      booking_time: {
        $gte: todayStart,
        $lte: todayEnd
      }
    }

    if (user.permission !== UserPermission.ADMINISTRATOR) {
      matchCondition['vehicle_info.user'] = user._id
    }

    const todayData = await databaseService.bill
      .aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
            localField: 'bus_route',
            foreignField: '_id',
            as: 'bus_route_info'
          }
        },
        { $unwind: { path: '$bus_route_info', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: process.env.DATABASE_VEHICLE_COLLECTION,
            localField: 'bus_route_info.vehicle',
            foreignField: '_id',
            as: 'vehicle_info'
          }
        },
        { $unwind: { path: '$vehicle_info', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: null,
            totalDeals: { $sum: 1 },
            totalTickets: { $sum: '$quantity' },
            totalRevenue: { $sum: { $multiply: ['$totalPrice', 0.95] } }
          }
        }
      ])
      .toArray()

    if (todayData.length > 0) {
      todayDeals = todayData[0].totalDeals
      todayTickets = todayData[0].totalTickets
      todayRevenue = todayData[0].totalRevenue
    }

    return {
      deals: todayDeals,
      tickets: todayTickets,
      revenue: todayRevenue
    }
  }

  async getWeeklyStatistics(user: User) {
    const today: Date = new Date()

    const currentDay = today.getDay()
    const firstDayOfWeek = new Date(today)
    const diff = currentDay === 0 ? 6 : currentDay - 1
    firstDayOfWeek.setDate(today.getDate() - diff)
    firstDayOfWeek.setHours(0, 0, 0, 0)

    const lastDayOfWeek = new Date(firstDayOfWeek)
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
    lastDayOfWeek.setHours(23, 59, 59, 999)

    const allDates: Array<{ date: Date; dateString: string; formattedDate: string }> = []
    const tempDate = new Date(firstDayOfWeek)

    while (tempDate <= lastDayOfWeek) {
      const day = String(tempDate.getDate()).padStart(2, '0')
      const month = String(tempDate.getMonth() + 1).padStart(2, '0')
      const formattedDate = `${day}/${month}`

      const utcDate = new Date(Date.UTC(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 0, 0, 0, 0))
      const dateString = utcDate.toISOString().split('T')[0]

      allDates.push({
        date: new Date(tempDate),
        dateString: dateString,
        formattedDate: formattedDate
      })

      tempDate.setDate(tempDate.getDate() + 1)
    }

    let pipeline = []

    const matchStage = {
      $match: {
        booking_time: {
          $gte: firstDayOfWeek,
          $lte: lastDayOfWeek
        }
      }
    }

    pipeline.push(matchStage)

    if (user.permission !== UserPermission.ADMINISTRATOR) {
      pipeline = [
        ...pipeline,
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
      ]
    }

    const commonStages = [
      {
        $addFields: {
          dateOnly: {
            $dateToString: { format: '%Y-%m-%d', date: '$booking_time', timezone: 'UTC' }
          },
          discountedPrice: {
            $multiply: ['$totalPrice', 0.95]
          }
        }
      }
    ]

    pipeline = [...pipeline, ...commonStages]

    const revenueByDayPipeline = [
      ...pipeline,
      {
        $group: {
          _id: '$dateOnly',
          totalRevenue: { $sum: '$discountedPrice' },
          totalDeals: { $sum: 1 },
          totalTickets: { $sum: '$quantity' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]

    const dailyData = await databaseService.bill.aggregate(revenueByDayPipeline).toArray()

    const weeklyTotalsPipeline = [
      ...pipeline,
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$discountedPrice' },
          totalDeals: { $sum: 1 },
          totalTickets: { $sum: '$quantity' },
          averageTicketValue: { $avg: '$discountedPrice' }
        }
      }
    ]

    const weeklyTotals = await databaseService.bill.aggregate(weeklyTotalsPipeline).toArray()

    const dailyDataMap: Record<string, any> = {}
    dailyData.forEach((item: any) => {
      dailyDataMap[item._id] = item
    })

    const formattedDailyData = allDates.map((dateObj) => {
      const dayData = dailyDataMap[dateObj.dateString] || { totalRevenue: 0, totalDeals: 0, totalTickets: 0 }

      return {
        date: dateObj.formattedDate,
        revenue: dayData.totalRevenue || 0,
        deals: dayData.totalDeals || 0,
        tickets: dayData.totalTickets || 0
      }
    })

    const wtdStats = {
      revenue: weeklyTotals.length > 0 ? weeklyTotals[0].totalRevenue : 0,
      deals: weeklyTotals.length > 0 ? weeklyTotals[0].totalDeals : 0,
      tickets: weeklyTotals.length > 0 ? weeklyTotals[0].totalTickets : 0,
      averageTicketValue: weeklyTotals.length > 0 ? weeklyTotals[0].averageTicketValue : 0
    }

    const firstDayOfPrevWeek = new Date(firstDayOfWeek)
    firstDayOfPrevWeek.setDate(firstDayOfPrevWeek.getDate() - 7)
    firstDayOfPrevWeek.setHours(0, 0, 0, 0)

    const lastDayOfPrevWeek = new Date(lastDayOfWeek)
    lastDayOfPrevWeek.setDate(lastDayOfPrevWeek.getDate() - 7)
    lastDayOfPrevWeek.setHours(23, 59, 59, 999)

    let prevWeekPipeline = []

    const prevWeekMatchStage = {
      $match: {
        booking_time: {
          $gte: firstDayOfPrevWeek,
          $lte: lastDayOfPrevWeek
        }
      }
    }

    prevWeekPipeline.push(prevWeekMatchStage)

    if (user.permission !== UserPermission.ADMINISTRATOR) {
      prevWeekPipeline = [
        ...prevWeekPipeline,
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
      ]
    }

    prevWeekPipeline = [
      ...prevWeekPipeline,
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
          totalRevenue: { $sum: '$discountedPrice' },
          totalDeals: { $sum: 1 },
          totalTickets: { $sum: '$quantity' }
        }
      }
    ]

    const prevWeekData = await databaseService.bill.aggregate(prevWeekPipeline).toArray()

    const prevWeekStats = {
      revenue: prevWeekData.length > 0 ? prevWeekData[0].totalRevenue : 0,
      deals: prevWeekData.length > 0 ? prevWeekData[0].totalDeals : 0,
      tickets: prevWeekData.length > 0 ? prevWeekData[0].totalTickets : 0
    }

    const calculatePercentChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0
      } else {
        return Math.round(((current - previous) / previous) * 100)
      }
    }

    const weekOverWeekChanges = {
      revenueChange: calculatePercentChange(wtdStats.revenue, prevWeekStats.revenue),
      dealsChange: calculatePercentChange(wtdStats.deals, prevWeekStats.deals),
      ticketsChange: calculatePercentChange(wtdStats.tickets, prevWeekStats.tickets)
    }

    const dayNames = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']
    const formattedDailyDataWithDayNames = formattedDailyData.map((item, index) => {
      return {
        ...item,
        dayName: dayNames[index]
      }
    })

    return {
      dailyData: formattedDailyDataWithDayNames,
      weekToDate: wtdStats,
      previousWeek: prevWeekStats,
      weekOverWeekChanges: weekOverWeekChanges
    }
  }

  async getMonthlyStatistics(user: User) {
    const today: Date = new Date()
    const firstDayOfMonth: Date = new Date(today.getFullYear(), today.getMonth(), 1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const lastDayOfMonth: Date = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    lastDayOfMonth.setHours(23, 59, 59, 999)

    const allDates: Array<{ date: Date; dateString: string; formattedDate: string }> = []
    const tempDate = new Date(firstDayOfMonth)

    while (tempDate <= lastDayOfMonth) {
      const day = String(tempDate.getDate()).padStart(2, '0')
      const month = String(tempDate.getMonth() + 1).padStart(2, '0')
      const formattedDate = `${day}/${month}`

      const utcDate = new Date(Date.UTC(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 0, 0, 0, 0))
      const dateString = utcDate.toISOString().split('T')[0]

      allDates.push({
        date: new Date(tempDate),
        dateString: dateString,
        formattedDate: formattedDate
      })

      tempDate.setDate(tempDate.getDate() + 1)
    }

    let pipeline = []

    const matchStage = {
      $match: {
        booking_time: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth
        }
      }
    }

    pipeline.push(matchStage)

    if (user.permission !== UserPermission.ADMINISTRATOR) {
      pipeline = [
        ...pipeline,
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
      ]
    }

    const commonStages = [
      {
        $addFields: {
          dateOnly: {
            $dateToString: { format: '%Y-%m-%d', date: '$booking_time', timezone: 'UTC' }
          },
          discountedPrice: {
            $multiply: ['$totalPrice', 0.95]
          }
        }
      }
    ]

    pipeline = [...pipeline, ...commonStages]

    const revenueByDayPipeline = [
      ...pipeline,
      {
        $group: {
          _id: '$dateOnly',
          totalRevenue: { $sum: '$discountedPrice' },
          totalDeals: { $sum: 1 },
          totalTickets: { $sum: '$quantity' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]

    const dailyData = await databaseService.bill.aggregate(revenueByDayPipeline).toArray()

    const monthlyTotalsPipeline = [
      ...pipeline,
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$discountedPrice' },
          totalDeals: { $sum: 1 },
          totalTickets: { $sum: '$quantity' },
          averageTicketValue: { $avg: '$discountedPrice' }
        }
      }
    ]

    const monthlyTotals = await databaseService.bill.aggregate(monthlyTotalsPipeline).toArray()

    const dailyDataMap: Record<string, any> = {}
    dailyData.forEach((item: any) => {
      dailyDataMap[item._id] = item
    })

    const formattedDailyData = allDates.map((dateObj) => {
      const dayData = dailyDataMap[dateObj.dateString] || { totalRevenue: 0, totalDeals: 0, totalTickets: 0 }

      return {
        date: dateObj.formattedDate,
        revenue: dayData.totalRevenue || 0,
        deals: dayData.totalDeals || 0,
        tickets: dayData.totalTickets || 0
      }
    })

    const mtdStats = {
      revenue: monthlyTotals.length > 0 ? monthlyTotals[0].totalRevenue : 0,
      deals: monthlyTotals.length > 0 ? monthlyTotals[0].totalDeals : 0,
      tickets: monthlyTotals.length > 0 ? monthlyTotals[0].totalTickets : 0,
      averageTicketValue: monthlyTotals.length > 0 ? monthlyTotals[0].averageTicketValue : 0
    }

    const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    firstDayOfPrevMonth.setHours(0, 0, 0, 0)

    const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    lastDayOfPrevMonth.setHours(23, 59, 59, 999)

    let prevMonthPipeline = []

    const prevMonthMatchStage = {
      $match: {
        booking_time: {
          $gte: firstDayOfPrevMonth,
          $lte: lastDayOfPrevMonth
        }
      }
    }

    prevMonthPipeline.push(prevMonthMatchStage)

    if (user.permission !== UserPermission.ADMINISTRATOR) {
      prevMonthPipeline = [
        ...prevMonthPipeline,
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
      ]
    }

    prevMonthPipeline = [
      ...prevMonthPipeline,
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
          totalRevenue: { $sum: '$discountedPrice' },
          totalDeals: { $sum: 1 },
          totalTickets: { $sum: '$quantity' }
        }
      }
    ]

    const prevMonthData = await databaseService.bill.aggregate(prevMonthPipeline).toArray()

    const prevMonthStats = {
      revenue: prevMonthData.length > 0 ? prevMonthData[0].totalRevenue : 0,
      deals: prevMonthData.length > 0 ? prevMonthData[0].totalDeals : 0,
      tickets: prevMonthData.length > 0 ? prevMonthData[0].totalTickets : 0
    }

    const calculatePercentChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0
      } else {
        return Math.round(((current - previous) / previous) * 100)
      }
    }

    const monthOverMonthChanges = {
      revenueChange: calculatePercentChange(mtdStats.revenue, prevMonthStats.revenue),
      dealsChange: calculatePercentChange(mtdStats.deals, prevMonthStats.deals),
      ticketsChange: calculatePercentChange(mtdStats.tickets, prevMonthStats.tickets)
    }

    return {
      dailyData: formattedDailyData,
      monthToDate: mtdStats,
      previousMonth: prevMonthStats,
      monthOverMonthChanges: monthOverMonthChanges
    }
  }
}

const statisticsService = new StatisticalService()
export default statisticsService
