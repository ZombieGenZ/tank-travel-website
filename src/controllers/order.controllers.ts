import BillDetail from '~/models/schemas/billDetail.schemas'
import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ORDER_MESSAGE } from '~/constants/message'
import {
  OrderRequestBody,
  GetOrderRequestBody,
  GetOrderDetailRequestBody,
  CancelTicketRequestBody
} from '~/models/requests/order.requests'
import BusRoute from '~/models/schemas/busRoute.schemas'
import User from '~/models/schemas/users.schemas'
import OrderService from '~/services/order.services'
import { writeInfoLog, writeErrorLog } from '~/utils/log'

export const orderController = async (
  req: Request<ParamsDictionary, any, OrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip
  const user = req.user as User
  const busRoute = req.bus_route as BusRoute
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await OrderService.order(req.body, user, busRoute)

    await writeInfoLog(
      `Thực hiện tạo đơn hàng cho tuyến ${req.body.bus_route_id} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      message: ORDER_MESSAGE.ORDER_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện tạo đơn hàng cho tuyến ${req.body.bus_route_id} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: ORDER_MESSAGE.ORDER_FAILURE,
      authenticate
    })
  }
}

export const getOrderListController = async (
  req: Request<ParamsDictionary, any, GetOrderRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await OrderService.getOrderList(req.body, user)

    await writeInfoLog(`Thực hiện lấy danh sách các đơn hàng đã đặt thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy danh sách các đơn hàng đã đặt thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: ORDER_MESSAGE.GET_ORDER_FAILED,
      authenticate
    })
  }
}

export const getOrderDetailListController = async (
  req: Request<ParamsDictionary, any, GetOrderDetailRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await OrderService.getOrderDetailList(req.body, user)

    await writeInfoLog(`Thực hiện lấy chi tiết đơn hàng đã đặt thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy chi tiết đơn hàng đã đặt thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: ORDER_MESSAGE.GET_ORDER_DETAIL_FAILED,
      authenticate
    })
  }
}

export const getOrderController = async (req: Request<ParamsDictionary, any, GetOrderRequestBody>, res: Response) => {
  const ip = req.ip
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await OrderService.getOrder(req.body, user)

    await writeInfoLog(`Thực hiện lấy thông tin đơn hàng thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thông tin đơn hàng thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      messgae: ORDER_MESSAGE.GET_ORDER_DETAIL_FAILED,
      authenticate
    })
  }
}

export const cancelTicketController = async (
  req: Request<ParamsDictionary, any, CancelTicketRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const billDetail = req.billDetail as BillDetail

  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await OrderService.cancelTicketDetail(user, billDetail)

    await writeInfoLog(`Thực hiện hũy đơn hàng ${billDetail._id} thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      message: ORDER_MESSAGE.CANCELED_TICKET_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện hũy đơn hàng ${billDetail._id} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: ORDER_MESSAGE.CANCELED_TICKET_FAILURE,
      authenticate
    })
  }
}
