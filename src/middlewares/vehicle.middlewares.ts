import { Request, Response, NextFunction } from 'express'
import { VehicleImage } from '~/models/schemas/vehicle.chemas'
import { checkSchema, validationResult } from 'express-validator'
import { SeatType, UserPermission, VehicleTypeEnum } from '~/constants/enum'
import { VEHICLE_MESSGAE, AUTHENTICATION_MESSAGE } from '~/constants/message'
import fs from 'fs'
import User from '~/models/schemas/users.schemas'
import path from 'path'
import HTTPSTATUS from '~/constants/httpStatus'
import { verifyToken } from '~/utils/jwt'
import databaseService from '~/services/database.services'
import userService from '~/services/user.services'
import { ObjectId } from 'mongodb'
import { TokenPayload } from '~/models/requests/user.requests'
import { validate } from '~/utils/validation'

export const authenticateCreateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  const { refresh_token } = req.body

  if (!authorization || typeof authorization !== 'string' || authorization === '' || !authorization.split(' '[1])) {
    if (!refresh_token || typeof refresh_token !== 'string' || refresh_token === '') {
      await deleteTemporaryFile(req.files)
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
        await deleteTemporaryFile(req.files)
        res
          .status(HTTPSTATUS.UNAUTHORIZED)
          .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
        return
      }

      const new_access_token = await userService.signAccessToken(user_id)
      const new_refresh_token = await userService.signRefreshToken(user_id)
      await userService.changeRefreshToken(user_id, new_access_token)

      req.user = user
      req.access_token = new_access_token
      req.refresh_token = new_refresh_token

      next()
      return
    } catch (err) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: AUTHENTICATION_MESSAGE.REFRESH_TOKEN_INVALID })
    }
  }

  try {
    const token = authorization?.split(' ')[1]

    const decoded_access_token = (await verifyToken({
      token: token as string,
      publicKey: process.env.SECURITY_JWT_SECRET_ACCESS_TOKEN as string
    })) as TokenPayload

    const { user_id } = decoded_access_token
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
      await deleteTemporaryFile(req.files)
      res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
      return
    }

    req.user = user
    req.access_token = authorization
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
        await deleteTemporaryFile(req.files)
        res
          .status(HTTPSTATUS.UNAUTHORIZED)
          .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
        return
      }

      const new_access_token = await userService.signAccessToken(user_id)
      const new_refresh_token = await userService.signRefreshToken(user_id)
      await userService.changeRefreshToken(user_id, new_refresh_token)

      req.user = user
      req.access_token = new_access_token
      req.refresh_token = new_refresh_token

      next()
      return
    } catch (err) {
      await deleteTemporaryFile(req.files)
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: AUTHENTICATION_MESSAGE.REFRESH_TOKEN_INVALID })
    }
  }
}

export const permissionValidator = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  if (user && (user.permission == UserPermission.BUSINESS || user.permission == UserPermission.ADMINISTRATOR)) {
    next()
    return
  }

  deleteTemporaryFile(req.files)
  res.status(HTTPSTATUS.FORBIDDEN).json({
    messgae: AUTHENTICATION_MESSAGE.NOT_PERMISSION_TODO_THIS,
    authenticate
  })
}

export const createValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

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
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        deleteTemporaryFile(req.files)
        res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.mapped(), authenticate })
        return
      }
      next()
      return
    })
    .catch((err) => {
      deleteTemporaryFile(req.files)
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ message: err.mapped(), authenticate })
      return
    })
}

export const setupCreateImage = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const images = req.files as Express.Multer.File[]

  const directoryPath = path.join(__dirname, `../../public/images/upload/vehicle/${user._id}`)

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath)
  }

  const promises = [] as Promise<void>[]

  images.forEach((file: any) => {
    promises.push(
      new Promise((resolve, reject) => {
        try {
          fs.renameSync(file.path, path.join(directoryPath, file.filename))
          resolve()
        } catch (err) {
          reject()
        }
      })
    )
  })

  await Promise.allSettled(promises)

  const preview = [] as VehicleImage[]

  images.forEach((file: Express.Multer.File) => {
    const img: VehicleImage = {
      path: `public/images/upload/vehicle/${user._id}/${file.filename}`,
      type: file.mimetype,
      url: `${process.env.APP_URL}/images/upload/vehicle/${user._id}/${file.filename}`,
      size: file.size
    }
    preview.push(img)
  })

  req.preview = preview

  next()
}

export const deleteTemporaryFile = async (files: any) => {
  const promises = [] as Promise<void>[]

  files.forEach((file: any) => {
    promises.push(
      new Promise((resolve, reject) => {
        try {
          fs.unlinkSync(file.path)
          resolve()
        } catch (err) {
          reject()
        }
      })
    )
  })

  await Promise.allSettled(promises)
}

export const deleteValidator = validate(
  checkSchema(
    {
      vehicle_id: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_REQUIRED
        },
        isString: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(value) })

            if (vehicle === null) {
              throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
            }

            ;(req as Request).vehicle = vehicle
            return true
          }
        }
      }
    },
    ['body']
  )
)
