import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { UserPermission } from '~/constants/enum'
import { BUSROUTE_MESSAGE, VEHICLE_MESSGAE } from '~/constants/message'
import User from '~/models/schemas/users.schemas'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const createValidator = validate(
  checkSchema(
    {
      vehicle_id: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const user = (req as Request).user as User

            if (user.permission == UserPermission.ADMINISTRATOR) {
              const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(value) })

              if (vehicle === null) {
                throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
              }

              ;(req as Request).vehicle = vehicle
              return true
            } else {
              const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(value), user: user._id })

              if (vehicle === null) {
                throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
              }

              ;(req as Request).vehicle = vehicle
              return true
            }
          }
        }
      },
      start_point: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.START_POINT_IS_REQUIRED
        },
        trim: true,
        isLength: {
          options: {
            min: 5,
            max: 500
          },
          errorMessage: BUSROUTE_MESSAGE.START_POINT_LENGTH_MUST_BE_FROM_5_TO_500
        }
      },
      end_point: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.END_POINT_IS_REQUIRED
        },
        trim: true,
        isLength: {
          options: {
            min: 5,
            max: 500
          },
          errorMessage: BUSROUTE_MESSAGE.END_POINT_LENGTH_MUST_BE_FROM_5_TO_500
        },
        custom: {
          options: (value, { req }) => {
            if (value == req.body.start_point) {
              throw new Error(BUSROUTE_MESSAGE.START_POINT_AND_END_POINT_MUST_BE_DIFFERENT)
            }
            return true
          }
        }
      },
      departure_time: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.DEPARTURE_TIME_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: BUSROUTE_MESSAGE.DEPARTURE_TIME_MUST_BE_ISO8601
        }
      },
      arrival_time: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.ARRIVAL_TIME_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: BUSROUTE_MESSAGE.ARRIVAL_TIME_MUST_BE_ISO8601
        },
        custom: {
          options: (value, { req }) => {
            if (new Date(value) <= new Date(req.body.departure_time)) {
              throw new Error(BUSROUTE_MESSAGE.ARRIVAL_TIME_MUST_BE_GREATER_THAN_DEPARTURE_TIME)
            }
            return true
          }
        }
      },
      price: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.PRICE_IS_REQUIRED
        },
        isInt: {
          errorMessage: BUSROUTE_MESSAGE.PRICE_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(BUSROUTE_MESSAGE.PRICE_MUST_BE_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.QUANTITY_IS_REQUIRED
        },
        isInt: {
          errorMessage: BUSROUTE_MESSAGE.QUANTITY_MUST_BE_A_NUMBER
        },
        custom: {
          options: async (value, { req }) => {
            if (value < 0) {
              throw new Error(BUSROUTE_MESSAGE.QUANTITY_MUST_BE_GREATER_THAN_0)
            }

            const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(req.body.vehicle_id) })

            if (vehicle === null) {
              throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
            }

            if (value > vehicle.seats) {
              throw new Error(BUSROUTE_MESSAGE.QUANTITY_MUST_BE_LESS_THAN_OR_EQUAL_TO_VEHICLE_SEATS)
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateValidator = validate(
  checkSchema(
    {
      bus_route_id: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const user = (req as Request).user as User

            if (user.permission === UserPermission.ADMINISTRATOR) {
              const bus_route = await databaseService.busRoute.findOne({ _id: new ObjectId(value) })

              if (bus_route === null) {
                throw new Error(BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_NOT_EXIST)
              }

              return true
            } else {
              const result = await databaseService.busRoute
                .aggregate([
                  {
                    $match: { _id: new ObjectId(value) }
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
                      preserveNullAndEmptyArrays: true
                    }
                  },
                  {
                    $match: {
                      'vehicle_info.user': user._id
                    }
                  }
                ])
                .toArray()

              const bus_route = result[0]

              if (bus_route === null || bus_route === undefined) {
                throw new Error(BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_NOT_EXIST)
              }

              return true
            }
          }
        }
      },
      vehicle_id: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const user = (req as Request).user as User

            if (user.permission == UserPermission.ADMINISTRATOR) {
              const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(value) })

              if (vehicle === null) {
                throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
              }

              ;(req as Request).vehicle = vehicle
              return true
            } else {
              const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(value), user: user._id })

              if (vehicle === null) {
                throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
              }

              ;(req as Request).vehicle = vehicle
              return true
            }
          }
        }
      },
      start_point: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.START_POINT_IS_REQUIRED
        },
        trim: true,
        isLength: {
          options: {
            min: 5,
            max: 500
          },
          errorMessage: BUSROUTE_MESSAGE.START_POINT_LENGTH_MUST_BE_FROM_5_TO_500
        }
      },
      end_point: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.END_POINT_IS_REQUIRED
        },
        trim: true,
        isLength: {
          options: {
            min: 5,
            max: 500
          },
          errorMessage: BUSROUTE_MESSAGE.END_POINT_LENGTH_MUST_BE_FROM_5_TO_500
        },
        custom: {
          options: (value, { req }) => {
            if (value == req.body.start_point) {
              throw new Error(BUSROUTE_MESSAGE.START_POINT_AND_END_POINT_MUST_BE_DIFFERENT)
            }
            return true
          }
        }
      },
      departure_time: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.DEPARTURE_TIME_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: BUSROUTE_MESSAGE.DEPARTURE_TIME_MUST_BE_ISO8601
        }
      },
      arrival_time: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.ARRIVAL_TIME_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: BUSROUTE_MESSAGE.ARRIVAL_TIME_MUST_BE_ISO8601
        },
        custom: {
          options: (value, { req }) => {
            if (new Date(value) <= new Date(req.body.departure_time)) {
              throw new Error(BUSROUTE_MESSAGE.ARRIVAL_TIME_MUST_BE_GREATER_THAN_DEPARTURE_TIME)
            }
            return true
          }
        }
      },
      price: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.PRICE_IS_REQUIRED
        },
        isInt: {
          errorMessage: BUSROUTE_MESSAGE.PRICE_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(BUSROUTE_MESSAGE.PRICE_MUST_BE_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.QUANTITY_IS_REQUIRED
        },
        isInt: {
          errorMessage: BUSROUTE_MESSAGE.QUANTITY_MUST_BE_A_NUMBER
        },
        custom: {
          options: async (value, { req }) => {
            if (value < 0) {
              throw new Error(BUSROUTE_MESSAGE.QUANTITY_MUST_BE_GREATER_THAN_0)
            }

            const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(req.body.vehicle_id) })

            if (vehicle === null) {
              throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
            }

            if (value > vehicle.seats) {
              throw new Error(BUSROUTE_MESSAGE.QUANTITY_MUST_BE_LESS_THAN_OR_EQUAL_TO_VEHICLE_SEATS)
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const deleteValidator = validate(
  checkSchema(
    {
      bus_route_id: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const user = (req as Request).user as User

            if (user.permission === UserPermission.ADMINISTRATOR) {
              const bus_route = await databaseService.busRoute.findOne({ _id: new ObjectId(value) })

              if (bus_route === null) {
                throw new Error(BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_NOT_EXIST)
              }

              return true
            } else {
              const result = await databaseService.busRoute
                .aggregate([
                  {
                    $match: { _id: new ObjectId(value) }
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
                      preserveNullAndEmptyArrays: true
                    }
                  },
                  {
                    $match: {
                      'vehicle_info.user': user._id
                    }
                  }
                ])
                .toArray()

              const bus_route = result[0]

              console.log(bus_route)

              if (bus_route === null || bus_route === undefined) {
                throw new Error(BUSROUTE_MESSAGE.BUS_ROUTE_ID_IS_NOT_EXIST)
              }

              return true
            }
          }
        }
      }
    },
    ['body']
  )
)

export const getBusRouteValidator = validate(
  checkSchema(
    {
      current: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.CURRENT_IS_REQUIRED
        },
        isInt: {
          errorMessage: BUSROUTE_MESSAGE.CURRENT_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(BUSROUTE_MESSAGE.CURRENT_IS_MUST_BE_GREATER_THAN_0)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const findBusRouteValidator = validate(
  checkSchema(
    {
      keywords: {
        notEmpty: {
          errorMessage: BUSROUTE_MESSAGE.KEYWORDS_IS_REQUIRED
        },
        trim: true
      }
    },
    ['body']
  )
)