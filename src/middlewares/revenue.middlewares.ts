import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import HTTPSTATUS from '~/constants/httpStatus'
import { REVENUE_MESSAGE, SYSTEM_MESSAGE } from '~/constants/message'
import { validate } from '~/utils/validation'

export const createBankOrderValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      amount: {
        notEmpty: {
          errorMessage: REVENUE_MESSAGE.AMOUNT_REQUIRED
        },
        isInt: {
          errorMessage: REVENUE_MESSAGE.AMOUNT_MUST_BE_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 1000) {
              throw new Error(REVENUE_MESSAGE.AMOUNT_MUST_BE_GREATER_THAN_1000)
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

export const sepayApiKeyValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: REVENUE_MESSAGE.API_KEY_REQUIRED
        },
        custom: {
          options: (value) => {
            if (!value.startsWith('Apikey ')) {
              throw new Error(REVENUE_MESSAGE.API_KEY_INVALID)
            }

            if (value.split(' ')[1] !== process.env.SEPAY_API_KEY) {
              throw new Error(REVENUE_MESSAGE.API_KEY_INVALID)
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)
