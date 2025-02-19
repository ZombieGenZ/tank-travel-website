import { CheckoutBankOrderRequestBody, CreateBankOrderRequestBody } from '~/models/requests/revenue.requests'
import User from '~/models/schemas/users.schemas'
import databaseService from './database.services'
import Revenue from '~/models/schemas/revenue.schemas'
import { PaymentType } from '~/constants/enum'
import { ObjectId } from 'mongodb'
import { BankRevenue } from '~/constants/revenue'
import { db } from './firebase.services'
import { io } from '~/index'
import notificationPrivateService from './notificationPrivate.services'

class RevenueService {
  async createBankOrder(payload: CreateBankOrderRequestBody, user: User) {
    const result = await databaseService.revenue.insertOne(
      new Revenue({
        type: PaymentType.BANK,
        amount_deposit: payload.amount,
        user: user._id
      })
    )

    return {
      payment_qr_url: `https://qr.sepay.vn/img?acc=${process.env.BANK_ACCOUNT_NO}&bank=${process.env.BANK_BANK_ID}&amount=${payload.amount}&des=DH${result.insertedId}&template=compact`,
      order_id: `DH${result.insertedId}`,
      account_no: process.env.BANK_ACCOUNT_NO,
      account_name: process.env.BANK_ACCOUNT_NAME,
      bank_id: process.env.BANK_BANK_ID
    }
  }

  async checkoutBankOrder(payload: CheckoutBankOrderRequestBody) {
    if (payload.code == null) {
      return
    }

    const order_id = payload.code.substring(2)

    const revenue = await databaseService.revenue.findOne({ _id: new ObjectId(order_id) })

    const payment_info: BankRevenue = {
      account_no: payload.accountNumber,
      bank_name: payload.gateway,
      description: payload.content,
      amount: payload.transferAmount
    }

    const user = await databaseService.users.findOne({ _id: revenue?.user })

    const paymentFirebaseRealtime = db.ref(`payment/${revenue?.user}/${payload.code}`).push()
    const balanceFirebaseRealtime = db.ref(`balance/${user?._id}`).push()

    const message = `+${payload.transferAmount}đ nạp tiền qua ngân hàng`
    await Promise.all([
      databaseService.revenue.updateOne(
        {
          _id: new ObjectId(order_id)
        },
        {
          $set: {
            payment_info: payment_info,
            amount_received: payload.transferAmount
          }
        }
      ),
      databaseService.users.updateOne(
        {
          _id: revenue?.user
        },
        {
          $inc: {
            balance: payload.transferAmount
          }
        }
      ),
      paymentFirebaseRealtime.set({
        status: true
      }),
      io.to(`BANK_DH${revenue?._id}`).emit('update-order-status', {
        status: true,
        amount: payload.transferAmount
      }),
      notificationPrivateService.createNotification((user as User)._id, message),
      balanceFirebaseRealtime.set({
        type: '+',
        value: payload.transferAmount
      }),
      io.to(`user-${user?._id}`).emit('update-balance', {
        type: '+',
        value: payload.transferAmount
      })
    ])
  }
}

const revenueService = new RevenueService()
export default revenueService
