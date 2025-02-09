import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import HTTPSTATUS from '~/constants/httpStatus'
import { STATISTICS_MESSAGE } from '~/constants/message'

export const findStatisticalValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      start_time: {
        notEmpty: {
          errorMessage: STATISTICS_MESSAGE.START_TIME_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: STATISTICS_MESSAGE.START_TIME_IS_MUST_BE_A_VALID_DATE
        }
      },
      end_time: {
        notEmpty: {
          errorMessage: STATISTICS_MESSAGE.END_TIME_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: STATISTICS_MESSAGE.END_TIME_IS_MUST_BE_A_VALID_DATE
        },
        custom: {
          options: (value, { req }) => {
            if (new Date(value) < new Date(req.body.start_time)) {
              throw new Error(STATISTICS_MESSAGE.END_TIME_IS_MUST_BE_GREATER_THAN_START_TIME)
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
