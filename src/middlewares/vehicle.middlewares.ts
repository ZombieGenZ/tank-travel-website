import { NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { SeatType, VehicleTypeEnum } from '~/constants/enum'
import { VEHICLE_MESSGAE } from '~/constants/message'
import { validate } from '~/utils/validation'

export const createValidator = validate(
  checkSchema(
    {
      vehicle_type: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_TYPE_IS_REQUIRED
        },
        isInt: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_TYPE_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value in VehicleTypeEnum) {
              return true
            }
            return false
          }
        }
      },
      seat_type: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.SEAT_TYPE_IS_REQUIRED
        },
        isInt: {
          errorMessage: VEHICLE_MESSGAE.SEAT_TYPE_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value in SeatType) {
              return true
            }
            return false
          }
        }
      },
      seats: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.SEATS_IS_REQUIRED
        },
        isInt: {
          errorMessage: VEHICLE_MESSGAE.SEATS_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(VEHICLE_MESSGAE.SEATS_IS_MUST_BE_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      rules: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.RULES_IS_REQUIRED
        },
        isString: {
          errorMessage: VEHICLE_MESSGAE.RULES_IS_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 0,
            max: 2000
          },
          errorMessage: VEHICLE_MESSGAE.EMAIL_LENGTH_MUST_BE_FROM_0_TO_2000
        }
      },
      amenities: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.AMENITIES_IS_REQUIRED
        },
        isString: {
          errorMessage: VEHICLE_MESSGAE.AMENITIES_IS_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 0,
            max: 500
          },
          errorMessage: VEHICLE_MESSGAE.AMENITIES_LENGTH_MUST_BE_FROM_0_TO_500
        }
      },
      license_plate: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.LICENSE_PLATE_IS_REQUIRED
        },
        isString: {
          errorMessage: VEHICLE_MESSGAE.LICENSE_PLATE_IS_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 7,
            max: 8
          },
          errorMessage: VEHICLE_MESSGAE.LICENSE_PLATE_LENGTH_MUST_BE_FROM_7_TO_8
        }
      }
    },
    ['body']
  )
)
