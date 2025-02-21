import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTPSTATUS from '~/constants/httpStatus'
import { BUSINESS_REGISTRATION_MESSAGE, SYSTEM_MESSAGE } from '~/constants/message'
import databaseService from '~/services/database.services'
import UserServices from '~/services/user.services'
import { getEmailInfomation } from '~/utils/email'
import { validate } from '~/utils/validation'

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.NAME_IS_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_50
        }
      },
      email: {
        notEmpty: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.EMAIL_IS_REQUIRED
        },
        trim: true,
        isLength: {
          options: {
            min: 5,
            max: 100
          },
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
        },
        isEmail: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            if (!req.body.have_account) {
              const result = await UserServices.checkEmailExits(value)

              if (result) {
                throw new Error(BUSINESS_REGISTRATION_MESSAGE.EMAIL_IS_ALWAYS_EXISTENT)
              }
            }

            const email_infomation = await getEmailInfomation(value)

            if (!email_infomation) {
              throw new Error(BUSINESS_REGISTRATION_MESSAGE.EMAIL_IS_INVALID)
            }

            const result = await databaseService.businessRegistration.findOne({ email: value })

            if (result) {
              throw new Error(BUSINESS_REGISTRATION_MESSAGE.EMAIL_IS_ALWAYS_EXISTENT)
            }

            return true
          }
        }
      },
      phone: {
        notEmpty: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.PHONE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.PHONE_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 10,
            max: 11
          },
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
        },
        isMobilePhone: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.PHONE_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            if (!req.body.have_account) {
              const result = await UserServices.checkPhoneNumberExits(value)

              if (result) {
                throw new Error(BUSINESS_REGISTRATION_MESSAGE.PHONE_IS_ALWAYS_EXISTENT)
              }
            }

            const result = await databaseService.businessRegistration.findOne({ phone: value })

            if (result) {
              throw new Error(BUSINESS_REGISTRATION_MESSAGE.PHONE_IS_ALWAYS_EXISTENT)
            }

            return true
          }
        }
      },
      have_account: {
        notEmpty: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.HAVE_ACCOUNT_IS_REQUIRED
        },
        isBoolean: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.HAVE_ACCOUNT_MUST_BE_A_BOOLEAN
        }
      }
    },
    ['body']
  )
)

export const censorValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      business_registration_id: {
        notEmpty: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.BUSINESS_REGISTRATION_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.BUSINESS_REGISTRATION_ID_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const result = await databaseService.businessRegistration.findOne({ _id: new ObjectId(value) })

            if (result === null) {
              throw new Error(BUSINESS_REGISTRATION_MESSAGE.BUSINESS_REGISTRATION_ID_IS_NOT_EXISTENT)
            }

            ;(req as Request).business_registration = result

            return true
          }
        }
      },
      decision: {
        notEmpty: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.DECISION_IS_REQUIRED
        },
        isBoolean: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.DECISION_MUST_BE_A_BOOLEAN
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res
          .status(HTTPSTATUS.UNPROCESSABLE_ENTITY)
          .json({ message: SYSTEM_MESSAGE.VALIDATION_ERROR, errors: errors.mapped(), authenticate })
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

export const getBusinessRegistrationValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }
  checkSchema(
    {
      session_time: {
        notEmpty: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.SESSION_TIME_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.SESSION_TIME_IS_MUST_BE_A_DATE
        }
      },
      current: {
        notEmpty: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.CURRENT_IS_REQUIRED
        },
        isInt: {
          errorMessage: BUSINESS_REGISTRATION_MESSAGE.CURRENT_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(BUSINESS_REGISTRATION_MESSAGE.CURRENT_IS_MUST_BE_GREATER_THAN_0)
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
        res
          .status(HTTPSTATUS.UNPROCESSABLE_ENTITY)
          .json({ message: SYSTEM_MESSAGE.VALIDATION_ERROR, errors: errors.mapped(), authenticate })
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
