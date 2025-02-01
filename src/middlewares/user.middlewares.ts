import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { UserStatus } from '~/constants/enum'
import HTTPSTATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors'
import User from '~/models/schemas/users.schemas'
import databaseService from '~/services/database.services'
import UserServices from '~/services/user.services'
import { HashPassword } from '~/utils/encryption'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const sendEmailVerifyValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
      },
      trim: true,
      isString: {
        errorMessage: USER_MESSAGE.EMAIL_IS_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 5,
          max: 100
        },
        errorMessage: USER_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
      },
      isEmail: {
        errorMessage: USER_MESSAGE.EMAIL_IS_NOT_VALID
      },
      custom: {
        options: async (value) => {
          const user = await databaseService.users.findOne({ email: value })

          if (user !== null) {
            throw new Error(USER_MESSAGE.EMAIL_IS_ALWAYS_EXISTENT)
          }

          const email_verify_code = await databaseService.emailVerifyCodes.findOne({ email: value })

          if (email_verify_code !== null) {
            throw new Error(USER_MESSAGE.EMAIL_ALREADY_SENDING)
          }

          return true
        }
      }
    }
  })
)

export const reSendEmailVerifyValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
      },
      trim: true,
      isString: {
        errorMessage: USER_MESSAGE.EMAIL_IS_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 5,
          max: 100
        },
        errorMessage: USER_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
      },
      isEmail: {
        errorMessage: USER_MESSAGE.EMAIL_IS_NOT_VALID
      },
      custom: {
        options: async (value) => {
          const user = await databaseService.users.findOne({ email: value })

          if (user !== null) {
            throw new Error(USER_MESSAGE.EMAIL_IS_ALWAYS_EXISTENT)
          }

          const email_verify_code = await databaseService.emailVerifyCodes.findOne({ email: value })

          if (email_verify_code === null) {
            throw new Error(USER_MESSAGE.EMAIL_VERIFY_CODE_HAS_NOT_BEEN_SENT)
          }

          return true
        }
      }
    }
  })
)

export const registerValidator = validate(
  checkSchema(
    {
      display_name: {
        notEmpty: {
          errorMessage: USER_MESSAGE.DISPLAY_NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: USER_MESSAGE.DISPLAY_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage: USER_MESSAGE.DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50
        }
      },
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
        },
        trim: true,
        isLength: {
          options: {
            min: 5,
            max: 100
          },
          errorMessage: USER_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
        },
        isEmail: {
          errorMessage: USER_MESSAGE.EMAIL_IS_NOT_VALID
        },
        custom: {
          options: async (value) => {
            const result = await UserServices.checkEmailExits(value)

            if (result) {
              throw new Error(USER_MESSAGE.EMAIL_IS_ALWAYS_EXISTENT)
            }

            return true
          }
        }
      },
      phone: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PHONE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: USER_MESSAGE.PHONE_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 10,
            max: 11
          },
          errorMessage: USER_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
        },
        isMobilePhone: {
          errorMessage: USER_MESSAGE.PHONE_IS_NOT_VALID
        },
        custom: {
          options: async (value) => {
            const result = await UserServices.checkPhoneNumberExits(value)

            if (result) {
              throw new Error(USER_MESSAGE.PHONE_IS_ALWAYS_EXISTENT)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 8,
            max: 100
          },
          errorMessage: USER_MESSAGE.PASSOWRD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          errorMessage: USER_MESSAGE.PASSOWRD_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.COMFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.COMFIRM_PASSWORD_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 8,
            max: 100
          },
          errorMessage: USER_MESSAGE.COMFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          errorMessage: USER_MESSAGE.COMFORM_PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: async (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGE.COMFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
            }
            return true
          }
        }
      },
      email_verify_code: {
        notEmpty: {
          errorMessage: USER_MESSAGE.EMAIL_VERIFY_CODE_IS_REQUESTED
        },
        isString: {
          errorMessage: USER_MESSAGE.EMAIL_VERIFY_CODE_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 9,
            max: 9
          },
          errorMessage: USER_MESSAGE.EMAIL_VERIFY_CODE_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const email_verify_code = await databaseService.emailVerifyCodes.findOne({
              email: req.body.email,
              code: value
            })

            if (email_verify_code === null) {
              throw new Error(USER_MESSAGE.EMAIL_VERIFY_CODE_INVALID)
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: USER_MESSAGE.EMAIL_IS_MUST_BE_A_STRING
        },
        isEmail: {
          errorMessage: USER_MESSAGE.EMAIL_IS_NOT_VALID
        },
        isLength: {
          options: {
            min: 5,
            max: 100
          },
          errorMessage: USER_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
        },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: HashPassword(req.body.password)
            })

            if (user === null) {
              throw new Error(USER_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD)
            }

            if (user.user_type !== UserStatus.Verified) {
              throw new Error(USER_MESSAGE.USER_IS_NOT_VERIFIED)
            }

            ;(req as Request).user = user

            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_A_STRING
        },
        trim: true
      }
    },
    ['body']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.REFUSED_TOKEN_IS_REQUESTED,
                status: HTTPSTATUS.UNAUTHORIZED
              })
            }

            if (typeof value !== 'string') {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.REFUSED_TOKEN_MUST_BE_A_STRING,
                status: HTTPSTATUS.UNAUTHORIZED
              })
            }

            if (value === '') {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.REFUSED_TOKEN_IS_REQUESTED,
                status: HTTPSTATUS.UNAUTHORIZED
              })
            }

            try {
              const [decoded_refresh_token, refreshToken] = await Promise.all([
                verifyToken({ token: value, publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string }),
                databaseService.refreshToken.findOne({ token: value })
              ])

              if (refreshToken === null) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_DOES_NOT_EXIST,
                  status: HTTPSTATUS.UNAUTHORIZED
                })
              }

              ;(req as Request).decoded_refresh_token = decoded_refresh_token

              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_INVALID,
                  status: HTTPSTATUS.UNAUTHORIZED
                })
              }

              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const sendEmailForgotPasswordValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
      },
      trim: true,
      isString: {
        errorMessage: USER_MESSAGE.EMAIL_IS_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 5,
          max: 100
        },
        errorMessage: USER_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
      },
      isEmail: {
        errorMessage: USER_MESSAGE.EMAIL_IS_NOT_VALID
      },
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value })

          if (user === null) {
            throw new Error(USER_MESSAGE.USERS_NOT_FOUND)
          }

          ;(req as Request).user = user

          return true
        }
      }
    }
  })
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      token: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.TOKEN_IS_REQUESTED,
                status: HTTPSTATUS.UNAUTHORIZED
              })
            }

            if (typeof value !== 'string') {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.TOKEN_MUST_BE_A_STRING,
                status: HTTPSTATUS.UNAUTHORIZED
              })
            }

            if (value === '') {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.TOKEN_IS_REQUESTED,
                status: HTTPSTATUS.UNAUTHORIZED
              })
            }

            try {
              const decoded_token = await verifyToken({
                token: value,
                publicKey: process.env.SECURITY_JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
              })

              const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_token.user_id) })

              if (user === null) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.USER_NOT_FOUND,
                  status: HTTPSTATUS.UNAUTHORIZED
                })
              }

              if (user.forgot_password_token === '' || user.forgot_password_token !== value) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.FORGOT_PASSWORD_TOKEN_INVALID,
                  status: HTTPSTATUS.UNAUTHORIZED
                })
              }

              ;(req as Request).decoded_forgot_password_token = decoded_token

              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.TOKEN_INVALID,
                  status: HTTPSTATUS.UNAUTHORIZED
                })
              }

              throw error
            }
          }
        }
      },
      new_password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.NEW_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.NEW_PASSWORD_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 8,
            max: 100
          },
          errorMessage: USER_MESSAGE.NEW_PASSOWRD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          errorMessage: USER_MESSAGE.NEW_PASSOWRD_MUST_BE_STRONG
        }
      },
      comform_new_password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.COMFIRM_NEW_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.COMFIRM_NEW_PASSWORD_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 8,
            max: 100
          },
          errorMessage: USER_MESSAGE.COMFIRM_NEW_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          errorMessage: USER_MESSAGE.COMFORM_NEW_PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: async (value, { req }) => {
            if (value !== req.body.new_password) {
              throw new Error(USER_MESSAGE.COMFIRM_NEW_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)

export const changePasswordValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_A_STRING
        },
        custom: {
          options: async (value, { req }) => {
            const user = req.user as User

            if (HashPassword(value) !== user.password) {
              throw new Error(USER_MESSAGE.PASSWORD_INCORRECT)
            }

            return true
          }
        }
      },
      new_password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.NEW_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.NEW_PASSWORD_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 8,
            max: 100
          },
          errorMessage: USER_MESSAGE.NEW_PASSOWRD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          errorMessage: USER_MESSAGE.NEW_PASSOWRD_MUST_BE_STRONG
        },
        custom: {
          options: async (value, { req }) => {
            const user = req.user as User

            if (HashPassword(req.body.new_password) === user.password) {
              throw new Error(USER_MESSAGE.NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_OLD_PASSWORD)
            }

            return true
          }
        }
      },
      comform_new_password: {
        notEmpty: {
          errorMessage: USER_MESSAGE.COMFIRM_NEW_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGE.COMFIRM_NEW_PASSWORD_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 8,
            max: 100
          },
          errorMessage: USER_MESSAGE.COMFIRM_NEW_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          errorMessage: USER_MESSAGE.COMFORM_NEW_PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: async (value, { req }) => {
            if (value !== req.body.new_password) {
              throw new Error(USER_MESSAGE.COMFIRM_NEW_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
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
