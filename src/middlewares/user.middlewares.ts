import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import sharp from 'sharp'
import { UserStatus } from '~/constants/enum'
import HTTPSTATUS from '~/constants/httpStatus'
import { AUTHENTICATION_MESSAGE, SYSTEM_MESSAGE, USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors'
import { MulterFile } from '~/models/multerfile'
import { TokenPayload } from '~/models/requests/user.requests'
import User from '~/models/schemas/users.schemas'
import databaseService from '~/services/database.services'
import UserServices from '~/services/user.services'
import { HashPassword } from '~/utils/encryption'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import UsersServices from '~/services/user.services'
import fs from 'fs'
import { ImageType } from '~/constants/image'
import path from 'path'
import { formatDateFull2 } from '~/utils/date'
import AccountmManagementService from '~/services/accountManagement.services'
import { getEmailInfomation } from '~/utils/email'

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
          const email_infomation = await getEmailInfomation(value)

          if (!email_infomation) {
            throw new Error(USER_MESSAGE.EMAIL_IS_NOT_VALID)
          }

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

            if (user.user_type === UserStatus.UnVerified) {
              throw new Error(USER_MESSAGE.USER_IS_NOT_VERIFIED)
            }

            if (user.temporary) {
              throw new Error(USER_MESSAGE.USER_IS_TEMPORARY)
            }

            if (user.penalty !== null) {
              if (new Date(user.penalty.expired_at) < new Date()) {
                await AccountmManagementService.unBanAccount(user._id.toString())
              } else {
                throw new Error(
                  `Tài khoản của bạn đã bị khóa vì lý do ${user.penalty.reason} và sẽ được mở khóa vào ${formatDateFull2(user.penalty.expired_at)}`
                )
              }
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

export const checkTemporaryAccountValidator = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User

  if (user.temporary) {
    res.json({
      message: USER_MESSAGE.USER_IS_TEMPORARY
    })
    return
  }

  next()
}

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
              const decoded_refresh_token = (await verifyToken({
                token: value,
                publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
              })) as TokenPayload

              const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

              if (user === null || user === undefined) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.USER_NOT_FOUND,
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

export const changeDisplayNameValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      new_display_name: {
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
        },
        custom: {
          options: async (value, { req }) => {
            try {
              const decoded_token = await verifyToken({
                token: req.body.token,
                publicKey: process.env.SECURITY_JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
              })

              const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_token.user_id) })

              if (user?.password === HashPassword(value)) {
                throw new Error(USER_MESSAGE.NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_OLD_PASSWORD)
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

export const sendEmailVerifyLoginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

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
          const email_infomation = await getEmailInfomation(value)

          if (!email_infomation) {
            throw new Error(USER_MESSAGE.EMAIL_IS_NOT_VALID)
          }

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

export const reSendEmailVerifyLoginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

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
            const newPassword = HashPassword(value)

            if (newPassword === user.password) {
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

export const changeEmailValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      new_email: {
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
              email: req.body.new_email,
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

export const changePhoneValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      new_phone: {
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

export const AuthenticationValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  const { refresh_token } = req.body

  if (!authorization || typeof authorization !== 'string' || authorization === '' || !authorization.split(' ')[1]) {
    if (!refresh_token || typeof refresh_token !== 'string' || refresh_token === '') {
      deleteTemporaryFile(req.file)
      res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
      return
    }

    try {
      const decoded_refresh_token = (await verifyToken({
        token: refresh_token,
        publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
      })) as TokenPayload

      const { user_id } = decoded_refresh_token
      const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

      if (!user) {
        deleteTemporaryFile(req.file)
        res
          .status(HTTPSTATUS.UNAUTHORIZED)
          .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
        return
      }

      const new_access_token = await UsersServices.signAccessToken(user_id)
      const new_refresh_token = await UsersServices.signRefreshToken(user_id)
      await UsersServices.changeRefreshToken(refresh_token, new_refresh_token)

      req.user = user
      req.access_token = new_access_token
      req.refresh_token = new_refresh_token

      next()
      return
    } catch (err) {
      deleteTemporaryFile(req.file)
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: AUTHENTICATION_MESSAGE.REFRESH_TOKEN_INVALID })
    }
  }

  try {
    const token = authorization?.split(' ')[1]

    const decoded_access_token = (await verifyToken({
      token: token as string,
      publicKey: process.env.SECURITY_JWT_SECRET_ACCESS_TOKEN as string
    })) as TokenPayload

    await verifyToken({
      token: token as string,
      publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
    })

    const { user_id } = decoded_access_token
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
      deleteTemporaryFile(req.file)
      res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
      return
    }

    req.user = user
    req.access_token = token
    req.refresh_token = refresh_token

    next()
    return
  } catch {
    try {
      const decoded_refresh_token = (await verifyToken({
        token: refresh_token,
        publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
      })) as TokenPayload

      const { user_id } = decoded_refresh_token
      const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

      if (!user) {
        deleteTemporaryFile(req.file)
        res
          .status(HTTPSTATUS.UNAUTHORIZED)
          .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
        return
      }

      const new_access_token = await UsersServices.signAccessToken(user_id)
      const new_refresh_token = await UsersServices.signRefreshToken(user_id)
      await UsersServices.changeRefreshToken(refresh_token, new_refresh_token)

      req.user = user
      req.access_token = new_access_token
      req.refresh_token = new_refresh_token

      next()
      return
    } catch (err) {
      deleteTemporaryFile(req.file)
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: AUTHENTICATION_MESSAGE.REFRESH_TOKEN_INVALID })
    }
  }
}

export const image3x4Validator = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    if (!req.file) {
      deleteTemporaryFile(req.file)
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        message: USER_MESSAGE.AVATAR_IS_REQUIRED,
        authenticate
      })
      return
    }

    const file = req.file as MulterFile

    if (!file.mimetype.startsWith('image/')) {
      deleteTemporaryFile(req.file)
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        message: USER_MESSAGE.AVATAR_3X4_MUST_BE_IMAGE,
        authenticate
      })
      return
    }

    const image = sharp(file.path)
    const metadata = await image.metadata()

    // Kiểm tra tỷ lệ 3:4
    const expectedRatio = 3 / 4
    const actualRatio = metadata.width! / metadata.height!

    // Cho phép sai số 1%
    const tolerance = 0.01
    if (Math.abs(actualRatio - expectedRatio) > tolerance) {
      deleteTemporaryFile(req.file)
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        message: USER_MESSAGE.IMAGE_MUST_BE_3x4_ASPECT_RATIO,
        authenticate
      })
      return
    }

    const directoryPath = path.resolve(__dirname, '../../public/images/upload/avatar')
    const fileExt = path.extname(file.originalname)
    const newPath = path.join(directoryPath, `${user._id}${fileExt}`)

    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath)
    }

    fs.renameSync(file.path, newPath)

    const avatar: ImageType = {
      path: `public/images/upload/avatar/${user._id}${fileExt}`,
      type: file.mimetype,
      url: `${process.env.IMAGE_URL}/images/upload/avatar/${user._id}${fileExt}`,
      size: file.size
    }

    ;(req as Request).avatar = avatar

    next()
  } catch (error) {
    deleteTemporaryFile(req.file)
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ error, authenticate })
  }
}

const deleteTemporaryFile = async (file: any) => {
  try {
    fs.unlinkSync(file.path)
  } catch (err) {
    return
  }
}

export const changePasswordTemporaryValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

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

            if (!user.temporary) {
              throw new Error(USER_MESSAGE.ACCOUNT_IS_NOT_A_CURRENT_ACCOUNT)
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
            const newPassword = HashPassword(value)

            if (newPassword === req.body.password) {
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

export const loginManageValidator = validate(
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

            if (user.user_type === UserStatus.UnVerified) {
              throw new Error(USER_MESSAGE.USER_IS_NOT_VERIFIED)
            }

            if (user.penalty !== null) {
              if (new Date(user.penalty.expired_at) < new Date()) {
                await AccountmManagementService.unBanAccount(user._id.toString())
              } else {
                throw new Error(
                  `Tài khoản của bạn đã bị khóa vì lý do ${user.penalty.reason} và sẽ được mở khóa vào ${formatDateFull2(user.penalty.expired_at)}`
                )
              }
            }

            if (user.permission == 0) {
              throw new Error(USER_MESSAGE.NOT_PERMISSION_TODO_THIS)
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

export const bannedValidator = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const { access_token, refresh_token } = req

  if (user.penalty !== null) {
    if (new Date(user.penalty.expired_at) < new Date()) {
      await AccountmManagementService.unBanAccount(user._id.toString())
    } else {
      res.json({
        message: `Tài khoản của bạn đã bị khóa vì lý do ${user.penalty.reason} và sẽ được mở khóa vào ${formatDateFull2(user.penalty.expired_at)}`
      })
      return
    }
  }

  next()
}
