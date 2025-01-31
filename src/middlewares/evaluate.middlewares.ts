import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ObjectId } from 'mongodb'
import { UserPermission } from '~/constants/enum'
import HTTPSTATUS from '~/constants/httpStatus'
import { EVALUATE_MESSAGE } from '~/constants/message'
import User from '~/models/schemas/users.schemas'
import databaseService from '~/services/database.services'

export const createValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      vehicle_id: {
        notEmpty: {
          errorMessage: EVALUATE_MESSAGE.VEHICLE_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: EVALUATE_MESSAGE.VEHICLE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: EVALUATE_MESSAGE.VEHICLE_ID_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const user = (req as Request).user as User

            const evaluate = await databaseService.evaluate.findOne({ vehicle: new ObjectId(value), user: user._id })

            if (evaluate !== null) {
              throw new Error(EVALUATE_MESSAGE.VEHICLE_ID_IS_ALREADY_EVALUATED)
            }

            const bill = await databaseService.bill
              .aggregate([
                {
                  $match: {
                    user: user._id
                  }
                },
                {
                  $limit: 1
                },
                {
                  $lookup: {
                    from: process.env.DATABASE_BUS_ROUTE_COLLECTION,
                    localField: 'bus_route',
                    foreignField: '_id',
                    as: 'bus_route'
                  }
                },
                {
                  $unwind: '$bus_route'
                },
                {
                  $lookup: {
                    from: process.env.DATABASE_VEHICLE_COLLECTION,
                    localField: 'bus_route.vehicle',
                    foreignField: '_id',
                    as: 'vehicle'
                  }
                },
                {
                  $unwind: '$vehicle'
                },
                {
                  $match: {
                    'vehicle._id': new ObjectId(value)
                  }
                }
              ])
              .toArray()
              .then((result) => result[0])

            if (bill === null || bill === undefined) {
              throw new Error(EVALUATE_MESSAGE.VEHICLE_ID_IS_NOT_EXIST_IN_BILL)
            }

            ;(req as Request).vehicle = bill.vehicle

            return true
          }
        }
      },
      rating: {
        notEmpty: {
          errorMessage: EVALUATE_MESSAGE.RATING_IS_REQUIRED
        },
        custom: {
          options: (value) => {
            if (typeof value !== 'number') {
              throw new Error(EVALUATE_MESSAGE.RATING_IS_MUST_BE_A_NUMBER)
            }

            if (value < 1 || value > 5) {
              throw new Error(EVALUATE_MESSAGE.RATING_IS_INVALID)
            }

            return true
          }
        }
      },
      content: {
        notEmpty: {
          errorMessage: EVALUATE_MESSAGE.CONTENT_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: EVALUATE_MESSAGE.CONTENT_IS_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 500
          },
          errorMessage: EVALUATE_MESSAGE.CONTENT_LENGTH_MUST_BE_FROM_1_TO_500
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

export const updateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      evaluate_id: {
        notEmpty: {
          errorMessage: EVALUATE_MESSAGE.EVALUATE_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: EVALUATE_MESSAGE.EVALUATE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: EVALUATE_MESSAGE.EVALUATE_ID_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const user = (req as Request).user as User

            if (user.permission === UserPermission.ADMINISTRATOR) {
              const evaluate = await databaseService.evaluate.findOne({ _id: new ObjectId(value) })

              if (evaluate === null) {
                throw new Error(EVALUATE_MESSAGE.EVALUATE_ID_IS_NOT_EXIST)
              }

              ;(req as Request).evaluate = evaluate

              return true
            } else {
              const evaluate = await databaseService.evaluate.findOne({ _id: new ObjectId(value), user: user._id })

              if (evaluate === null) {
                throw new Error(EVALUATE_MESSAGE.EVALUATE_ID_IS_NOT_EXIST)
              }

              ;(req as Request).evaluate = evaluate
              return true
            }
          }
        }
      },
      rating: {
        notEmpty: {
          errorMessage: EVALUATE_MESSAGE.RATING_IS_REQUIRED
        },
        custom: {
          options: (value) => {
            if (typeof value !== 'number') {
              throw new Error(EVALUATE_MESSAGE.RATING_IS_MUST_BE_A_NUMBER)
            }

            if (value < 1 || value > 5) {
              throw new Error(EVALUATE_MESSAGE.RATING_IS_INVALID)
            }

            return true
          }
        }
      },
      content: {
        notEmpty: {
          errorMessage: EVALUATE_MESSAGE.CONTENT_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: EVALUATE_MESSAGE.CONTENT_IS_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 500
          },
          errorMessage: EVALUATE_MESSAGE.CONTENT_LENGTH_MUST_BE_FROM_1_TO_500
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

export const deleteValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      evaluate_id: {
        notEmpty: {
          errorMessage: EVALUATE_MESSAGE.EVALUATE_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: EVALUATE_MESSAGE.EVALUATE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: EVALUATE_MESSAGE.EVALUATE_ID_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const evaluate = await databaseService.evaluate.findOne({ _id: new ObjectId(value) })

            if (evaluate === null) {
              throw new Error(EVALUATE_MESSAGE.EVALUATE_ID_IS_NOT_EXIST)
            }

            ;(req as Request).evaluate = evaluate

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

export const getEvaluateValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      current: {
        notEmpty: {
          errorMessage: EVALUATE_MESSAGE.CURRENT_IS_REQUIRED
        },
        isInt: {
          errorMessage: EVALUATE_MESSAGE.CURRENT_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(EVALUATE_MESSAGE.CURRENT_IS_MUST_BE_GREATER_THAN_0)
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
