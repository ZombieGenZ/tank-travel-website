import { checkSchema } from 'express-validator'
import { USER_MESSAGE } from '~/constants/message'
import databaseService from '~/services/database.services'
import UserServices from '~/services/user.services'
import { HashPassword } from '~/utils/encryption'
import { validate } from '~/utils/validation'

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

            ;(req as any).user = user

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
      }
    },
    ['body']
  )
)
