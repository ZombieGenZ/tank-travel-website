import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTPSTATUS from '~/constants/httpStatus'
import { ORDER_MESSAGE } from '~/constants/message'
import { OrderRequestBody } from '~/models/requests/order.requests'
import { BusRoute } from '~/models/schemas/busRoute.schemas'
import User from '~/models/schemas/users.schemas'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const orderValidator = validate(
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
                    from: 'vehicles',
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
                    'vehicle_info.user': { $ne: user._id }
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

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const quantityValidator = (
  req: Request<ParamsDictionary, any, OrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const busRoute = req.bus_route as BusRoute
  const { quantity } = req.body

  if (isNaN(busRoute.quantity) || isNaN(quantity)) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ message: ORDER_MESSAGE.QUANTITY_MUST_BE_INT })
    return
  }

  const remainingQuantity = busRoute.quantity - quantity

  if (remainingQuantity < 0) {
    res
      .status(HTTPSTATUS.UNPROCESSABLE_ENTITY)
      .json({ message: ORDER_MESSAGE.QUANTITY_MUST_BE_LESS_THAN_REMAINING_QUANTITY })
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

  const totalPrice = quantity * busRoute.price

  if (totalPrice > user.balance) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ message: ORDER_MESSAGE.BALANCE_NOT_ENOUGH })
    return
  }

  next()
}
