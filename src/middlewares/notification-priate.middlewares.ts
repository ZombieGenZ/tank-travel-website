import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import HTTPSTATUS from '~/constants/httpStatus'
import { NOTIFICATION_PRIATE_MESSAGE, SYSTEM_MESSAGE } from '~/constants/message'

export const getNotificationPrivateValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }
  checkSchema(
    {
      session_time: {
        notEmpty: {
          errorMessage: NOTIFICATION_PRIATE_MESSAGE.SESSION_TIME_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: NOTIFICATION_PRIATE_MESSAGE.SESSION_TIME_IS_MUST_BE_A_DATE
        }
      },
      current: {
        notEmpty: {
          errorMessage: NOTIFICATION_PRIATE_MESSAGE.CURRENT_IS_REQUIRED
        },
        isInt: {
          errorMessage: NOTIFICATION_PRIATE_MESSAGE.CURRENT_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(NOTIFICATION_PRIATE_MESSAGE.CURRENT_IS_MUST_BE_GREATER_THAN_0)
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
