import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ORDER_MESSAGE } from '~/constants/message'
import { OrderRequestBody, GetOrderRequestBody, GetOrderDetailRequestBody } from '~/models/requests/order.requests'
import { BusRoute } from '~/models/schemas/busRoute.schemas'
import User from '~/models/schemas/users.schemas'
import OrderService from '~/services/order.services'

export const orderController = async (
  req: Request<ParamsDictionary, any, OrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const busRoute = req.bus_route as BusRoute
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await OrderService.order(req.body, user, busRoute)

  res.json({
    message: ORDER_MESSAGE.ORDER_SUCCESS,
    authenticate
  })
}

export const getOrderListController = async (
  req: Request<ParamsDictionary, any, GetOrderRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await OrderService.getOrderList(req.body, user)

  res.json({
    result,
    authenticate
  })
}

export const getOrderDetailListController = async (
  req: Request<ParamsDictionary, any, GetOrderDetailRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await OrderService.getOrderDetailList(req.body, user)

  res.json({
    result,
    authenticate
  })
}

export const getOrderController = async (req: Request<ParamsDictionary, any, GetOrderRequestBody>, res: Response) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await OrderService.getOrderList(req.body, user)

  res.json({
    result,
    authenticate
  })
}
