import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { checkSchema, validationResult } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTPSTATUS from '~/constants/httpStatus'
import { ORDER_MESSAGE } from '~/constants/message'
import {
  OrderRequestBody,
  GetOrderRequestBody,
  GetOrderDetailRequestBody,
  CancelTicketRequestBody
} from '~/models/requests/order.requests'
import BusRoute from '~/models/schemas/busRoute.schemas'
import User from '~/models/schemas/users.schemas'
import databaseService from '~/services/database.services'
import BillDetail from '~/models/schemas/billDetail.schemas'
import { TicketStatus } from '~/constants/enum'

export const orderValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }
  checkSchema(
    {
      bus_route_id: {
        notEmpty: {
          errorMessage: ORDER_MESSAGE.BUS_ROUTE_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: ORDER_MESSAGE.BUS_ROUTE_ID_MUST_BE_STRING
        },
        isMongoId: {
          errorMessage: ORDER_MESSAGE.BUS_ROUTE_ID_MUST_BE_MONGO_ID
        },
        custom: {
          options: async (value, { req }) => {
            const user = (req as Request).user as User
            // const busRoute = await databaseService.busRoute.findOne({ _id: value })
            const busRoute = await databaseService.busRoute
              .aggregate<BusRoute>([
                {
                  $match: {
                    _id: new ObjectId(value)
                  }
                },
                {
                  $lookup: {
                    from: process.env.DATABASE_VEHICLE_COLLECTION,
                    localField: 'vehicle',
                    foreignField: '_id',
                    as: 'vehicle_info'
                  }
                },
                {
                  $unwind: {
                    path: '$vehicle_info',
                    preserveNullAndEmptyArrays: false
                  }
                },
                {
                  $match: {
                    'vehicle_info.user': { $ne: user._id },
                    'vehicle_info.status': 1
                  }
                },
                {
                  $project: {
                    vehicle_info: 0
                  }
                }
              ])
              .toArray()

            if (busRoute === null || busRoute === undefined || busRoute.length === 0) {
              throw new Error(ORDER_MESSAGE.BUS_ROUTE_ID_NOT_EXIST)
            }

            ;(req as Request).bus_route = busRoute[0]

            return true
          }
        }
      },
      name: {
        notEmpty: {
          errorMessage: ORDER_MESSAGE.NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: ORDER_MESSAGE.NAME_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 150
          },
          errorMessage: ORDER_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_150
        }
      },
      phone: {
        notEmpty: {
          errorMessage: ORDER_MESSAGE.PHONE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: ORDER_MESSAGE.PHONE_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 10,
            max: 11
          },
          errorMessage: ORDER_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
        },
        isMobilePhone: {
          errorMessage: ORDER_MESSAGE.PHONE_MUST_BE_MOBILE_PHONE
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: ORDER_MESSAGE.QUANTITY_IS_REQUIRED
        },
        isInt: {
          errorMessage: ORDER_MESSAGE.QUANTITY_MUST_BE_INT
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(ORDER_MESSAGE.QUANTITY_MUST_BE_GREATER_THAN_0)
            }

            if (value > 999) {
              throw new Error(ORDER_MESSAGE.QUANTITY_MUST_BE_LESS_THAN_1000)
            }

            return true
          }
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.mapped(), authenticate })
        return
      }
      next()
      return
    })
    .catch((err) => {
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ message: err, authenticate })
      return
    })
}

export const quantityValidator = (
  req: Request<ParamsDictionary, any, OrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const busRoute = req.bus_route as BusRoute
  const { quantity } = req.body
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  if (isNaN(busRoute.quantity) || isNaN(quantity)) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
      message: ORDER_MESSAGE.QUANTITY_MUST_BE_INT,
      authenticate
    })
    return
  }

  const remainingQuantity = busRoute.quantity - quantity

  if (remainingQuantity < 0) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
      message: ORDER_MESSAGE.QUANTITY_MUST_BE_LESS_THAN_REMAINING_QUANTITY,
      authenticate
    })
    return
  }

  next()
}

export const priceValidator = (
  req: Request<ParamsDictionary, any, OrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const busRoute = req.bus_route as BusRoute
  const { quantity } = req.body as { quantity: number }
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const totalPrice = quantity * busRoute.price

  if (totalPrice > user.balance) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
      message: ORDER_MESSAGE.BALANCE_NOT_ENOUGH,
      authenticate
    })
    return
  }

  next()
}

export const getOrderValidator = (
  req: Request<ParamsDictionary, any, GetOrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      session_time: {
        notEmpty: {
          errorMessage: ORDER_MESSAGE.SESSION_TIME_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: ORDER_MESSAGE.SESSION_TIME_IS_MUST_BE_A_DATE
        }
      },
      current: {
        notEmpty: {
          errorMessage: ORDER_MESSAGE.CURRENT_IS_REQUIRED
        },
        isInt: {
          errorMessage: ORDER_MESSAGE.CURRENT_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(ORDER_MESSAGE.CURRENT_IS_MUST_BE_GREATER_THAN_0)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.mapped(), authenticate })
        return
      }
      next()
      return
    })
    .catch((err) => {
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ message: err, authenticate })
      return
    })
}

export const getOrderDetailValidator = (
  req: Request<ParamsDictionary, any, GetOrderDetailRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      order_id: {
        notEmpty: {
          errorMessage: ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: ORDER_MESSAGE.ORDER_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: ORDER_MESSAGE.ORDER_ID_IS_MUST_BE_A_MONGO_ID
        },
        custom: {
          options: async (value) => {
            const user = req.user as User
            const bill = await databaseService.bill.findOne({
              _id: new ObjectId(value),
              user: user._id
            })

            if (bill === null) {
              throw new Error(ORDER_MESSAGE.ORDER_ID_IS_NOT_EXIST)
            }

            return true
          }
        }
      },
      current: {
        notEmpty: {
          errorMessage: ORDER_MESSAGE.CURRENT_IS_REQUIRED
        },
        isInt: {
          errorMessage: ORDER_MESSAGE.CURRENT_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(ORDER_MESSAGE.CURRENT_IS_MUST_BE_GREATER_THAN_0)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.mapped(), authenticate })
        return
      }
      next()
      return
    })
    .catch((err) => {
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ message: err, authenticate })
      return
    })
}

export const cancelTicketValidator = async (
  req: Request<ParamsDictionary, any, CancelTicketRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      ticket_id: {
        notEmpty: {
          errorMessage: ORDER_MESSAGE.TICKET_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: ORDER_MESSAGE.TICKET_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: ORDER_MESSAGE.TICKET_ID_IS_MUST_BE_A_MONGO_ID
        },
        custom: {
          options: async (value, { req }) => {
            const user = req.user as User
            const ticket = await databaseService.billDetail
              .aggregate<BillDetail>([
                {
                  $lookup: {
                    from: process.env.DATABASE_BILL_COLLECTION,
                    localField: 'bill',
                    foreignField: '_id',
                    as: 'bill_info'
                  }
                },
                {
                  $unwind: '$bill_info'
                },
                {
                  $match: {
                    _id: new ObjectId(value),
                    'bill_info.user': user._id,
                    status: TicketStatus.PAID
                  }
                },
                {
                  $project: {
                    bill_info: 0
                  }
                }
              ])
              .toArray()
              .then((tickets) => tickets[0])

            if (ticket === null || ticket === undefined) {
              throw new Error(ORDER_MESSAGE.TICKET_ID_IS_NOT_EXIST)
            }

            const bill = await databaseService.bill.findOne({ _id: ticket.bill })
            const busRoute = await databaseService.busRoute.findOne({ _id: bill?.bus_route })

            if (busRoute === null || busRoute === undefined) {
              throw new Error(ORDER_MESSAGE.BUS_ROUTE_IS_NOT_EXIST)
            }

            if (busRoute.departure_time < new Date()) {
              throw new Error(ORDER_MESSAGE.BUS_ROUTE_IS_DEPARTURED)
            }

            ;(req as Request).billDetail = ticket

            return true
          }
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.mapped(), authenticate })
        return
      }
      next()
      return
    })
    .catch((err) => {
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ message: err, authenticate })
      return
    })
}
