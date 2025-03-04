import { io } from '~/index'
import databaseService from '~/services/database.services'
import { db } from '~/services/firebase.services'
import notificationPrivateService from '~/services/notificationPrivate.services'
import { writeInfoLog } from '~/utils/log'

export const automaticReward = async () => {
  const today: Date = new Date()
  const firstDayOfMonth: Date = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth: Date = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  firstDayOfMonth.setHours(0, 0, 0, 0)
  lastDayOfMonth.setHours(23, 59, 59, 999)

  const bonusList = [1000000, 800000, 600000, 500000, 400000, 300000, 250000, 200000, 150000, 100000]

  const topUsers = await databaseService.bill
    .aggregate([
      {
        $match: {
          booking_time: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth
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
      { $unwind: '$bus_route_info' },
      {
        $lookup: {
          from: process.env.DATABASE_VEHICLE_COLLECTION,
          localField: 'bus_route_info.vehicle',
          foreignField: '_id',
          as: 'vehicle_info'
        }
      },
      { $unwind: '$vehicle_info' },
      {
        $lookup: {
          from: process.env.DATABASE_USER_COLLECTION,
          localField: 'vehicle_info.user',
          foreignField: '_id',
          as: 'user_info'
        }
      },
      { $unwind: '$user_info' },
      {
        $addFields: {
          discountedPrice: { $multiply: ['$totalPrice', 0.95] }
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
          balance: '$user.balance'
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ])
    .toArray()

  for (let i = 0; i < topUsers.length; i++) {
    const user = topUsers[i]

    if (!user) break

    const bonusAmount = bonusList[i]
    const updatedBalance = user.balance + bonusAmount

    const balanceFirebaseRealtime = db.ref(`balance/${user.userId}`).push()
    const notificationMessage = `+${bonusAmount.toLocaleString('vi-VN')} đ Phần thưởng TOP ${i + 1} trong bản xếp hạng doanh thu`
    await Promise.all([
      databaseService.users.updateOne({ _id: user.userId }, { $set: { balance: updatedBalance } }),
      notificationPrivateService.createNotification(user.userId, notificationMessage),
      balanceFirebaseRealtime.set({
        type: '+',
        value: bonusAmount
      }),
      io.to(`user-${user.userId}`).emit('update-balance', {
        type: '+',
        value: bonusAmount
      })
    ])
  }

  await writeInfoLog(`Thực hiện trao giải bản xếp hạng doanh thu thành công!`)
}
