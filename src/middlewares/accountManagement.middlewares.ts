import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTPSTATUS from '~/constants/httpStatus'
import { ACCOUNT_MANAGEMENT_MESSAGE } from '~/constants/message'
import databaseService from '~/services/database.services'

export const getAccountValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      current: {
        notEmpty: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.CURRENT_IS_REQUIRED
        },
        isInt: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.CURRENT_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(ACCOUNT_MANAGEMENT_MESSAGE.CURRENT_IS_MUST_BE_GREATER_THAN_0)
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

export const findAccountValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      keywords: {
        notEmpty: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.KEYWORDS_IS_REQUIRED
        },
        trim: true
      },
      current: {
        notEmpty: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.CURRENT_IS_REQUIRED
        },
        isInt: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.CURRENT_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(ACCOUNT_MANAGEMENT_MESSAGE.CURRENT_IS_MUST_BE_GREATER_THAN_0)
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

export const banAccountValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      user_id: {
        notEmpty: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_REQUIRED
        },
        trim: true,
        isMongoId: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_INVALID
        },
        custom: {
          options: async (value) => {
            const user = await databaseService.users.findOne({ _id: new ObjectId(value) })

            if (user === null) {
              throw new Error(ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_NOT_EXIST)
            }

            if (user.penalty !== null) {
              throw new Error(ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_ALREADY_BANNED)
            }

            return
          }
        }
      },
      reason: {
        notEmpty: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.REASON_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.REASON_IS_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 500
          },
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.REASON_IS_MUST_BE_BETWEEN_1_AND_500_CHARACTERS
        }
      },
      expired_at: {
        notEmpty: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.EXPIRED_AT_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.EXPIRED_AT_IS_MUST_BE_A_VALID_DATE
        },
        custom: {
          options: (value) => {
            if (new Date(value) < new Date()) {
              throw new Error(ACCOUNT_MANAGEMENT_MESSAGE.EXPIRED_AT_IS_MUST_BE_GREATER_THAN_CURRENT_DATE)
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

export const unBanAccountValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      user_id: {
        notEmpty: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_REQUIRED
        },
        trim: true,
        isMongoId: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_INVALID
        },
        custom: {
          options: async (value) => {
            const user = await databaseService.users.findOne({ _id: new ObjectId(value) })

            if (user === null) {
              throw new Error(ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_NOT_EXIST)
            }

            if (user.penalty === null) {
              throw new Error(ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_NOT_BANNED)
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

export const sendNotificationValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      user_id: {
        notEmpty: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_REQUIRED
        },
        trim: true,
        isMongoId: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_INVALID
        },
        custom: {
          options: async (value) => {
            const user = await databaseService.users.findOne({ _id: new ObjectId(value) })

            if (user === null) {
              throw new Error(ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_NOT_EXIST)
            }

            return true
          }
        }
      },
      message: {
        notEmpty: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.MESSAGE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.MESSAGE_IS_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 500
          },
          errorMessage: ACCOUNT_MANAGEMENT_MESSAGE.MESSAGE_IS_MUST_BE_BETWEEN_1_AND_500_CHARACTERS
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
