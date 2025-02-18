import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { REVENUE_MESSAGE } from '~/constants/message'
import { CreateBankOrderRequestBody, CheckoutBankOrderRequestBody } from '~/models/requests/revenue.requests'
import User from '~/models/schemas/users.schemas'
import RevenueService from '~/services/revenue.services'
import { writeErrorLog, writeInfoLog } from '~/utils/log'

export const createBankOrderController = async (
  req: Request<ParamsDictionary, any, CreateBankOrderRequestBody>,
  res: Response
) => {
  const ip = req.ip as string
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await RevenueService.createBankOrder(req.body, user)

    await writeInfoLog(`Thực hiện tạo đơn thanh toán ngân hàng thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện tạo đơn thanh toán ngân hàng thất bại (User: ${user._id}) (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: REVENUE_MESSAGE.CREATE_BANK_ORDER_FAILURE,
      authenticate
    })
  }
}

export const checkoutBankOrderController = async (
  req: Request<ParamsDictionary, any, CheckoutBankOrderRequestBody>,
  res: Response
) => {
  const ip = req.ip as string

  try {
    await RevenueService.checkoutBankOrder(req.body)

    await writeInfoLog(`Thực hiện xác nhận đơn thanh toán ngân hàng thành công (IP: ${ip}])`)

    res.json({
      message: REVENUE_MESSAGE.CHECKOUT_ORDER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện xác nhận đơn thanh toán ngân hàng thất bại (IP: ${ip}]) Error: ${err}`)

    res.json({
      message: REVENUE_MESSAGE.CHECKOUT_ORDER_FAILURE
    })
  }
}
