import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ORDER_MESSAGE } from '~/constants/message'
import { OrderRequestBody } from '~/models/requests/order.requests'
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
