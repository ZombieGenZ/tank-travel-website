import { CheckoutBankOrderRequestBody, CreateBankOrderRequestBody } from '~/models/requests/revenue.requests'
import User from '~/models/schemas/users.schemas'
import databaseService from './database.services'
import Revenue from '~/models/schemas/revenue.schemas'
import { PaymentType } from '~/constants/enum'
import { ObjectId } from 'mongodb'
import { BankRevenue } from '~/constants/revenue'

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
    const order_id = payload.content.substring(2)

    const revenue = await databaseService.revenue.findOne({ _id: new ObjectId(order_id) })

    const payment_info: BankRevenue = {
      account_no: payload.accountNumber,
      bank_name: payload.gateway,
      description: payload.content,
      amount: payload.transferAmount
    }

    await Promise.all([
      databaseService.revenue.updateOne(
        {
          _id: new ObjectId(order_id)
        },
        {
          $set: {
            payment_info: payment_info
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
      )
    ])
  }
}

const revenueService = new RevenueService()
export default revenueService
