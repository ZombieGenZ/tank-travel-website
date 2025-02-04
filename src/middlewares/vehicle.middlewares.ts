import { Request, Response, NextFunction } from 'express'
import { ImageType } from '~/constants/image'
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
import sharp from 'sharp'

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

    await verifyToken({
      token: token as string,
      publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
    })

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

  if (!req.files || !Array.isArray(req.files) || req.files.length < 1) {
    res.json({
      message: VEHICLE_MESSGAE.IMAGE_IS_REQUIRED,
      authenticate
    })
    return
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
            throw new Error(VEHICLE_MESSGAE.VEHICLE_TYPE_IS_INVALID)
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
            throw new Error(VEHICLE_MESSGAE.SEAT_TYPE_IS_INVALID)
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
          errorMessage: VEHICLE_MESSGAE.EMAIL_LENGTH_MUST_BE_FROM_10_TO_2000
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
        },
        custom: {
          options: async (value) => {
            const vehicle = await databaseService.vehicles.findOne({ license_plate: value })

            if (vehicle !== null) {
              throw new Error(VEHICLE_MESSGAE.LICENSE_PLATE_IS_ALREADY_EXISTS)
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
        deleteTemporaryFile(req.files)
        res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.mapped(), authenticate })
        return
      }
      next()
      return
    })
    .catch((err) => {
      deleteTemporaryFile(req.files)
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ message: err, authenticate })
      return
    })
}

export const setupCreateImage = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const images = req.files as Express.Multer.File[]

  const directoryPath = path.join(__dirname, `../../public/images/upload/vehicle/${user._id}`)

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
  }

  const movePromises = images.map(
    (file: Express.Multer.File) =>
      new Promise<void>((resolve, reject) => {
        try {
          fs.renameSync(file.path, path.join(directoryPath, file.filename))
          resolve()
        } catch (err) {
          reject(err)
        }
      })
  )

  await Promise.all(movePromises)

  const watermarkImagePath = path.join(__dirname, '../../public/images/system/watermark.png')

  const processPromises = images.map(
    (file: Express.Multer.File) =>
      new Promise<ImageType>((resolve, reject) => {
        const imgPath = path.join(directoryPath, file.filename)

        sharp(imgPath)
          .metadata()
          .then((metadata) => {
            return sharp(watermarkImagePath)
              .metadata()
              .then((watermarkMetadata) => {
                if (!metadata.width || !metadata.height || !watermarkMetadata.width || !watermarkMetadata.height) {
                  throw new Error('Could not get image dimensions')
                }

                const x = metadata.width - watermarkMetadata.width - 30
                const y = metadata.height - watermarkMetadata.height - 30

                return sharp(imgPath)
                  .composite([
                    {
                      input: watermarkImagePath,
                      left: x,
                      top: y
                    }
                  ])
                  .toBuffer()
              })
              .then((buffer) => {
                return sharp(buffer)
                  .toFile(imgPath + '_temp')
                  .then(() => {
                    fs.unlinkSync(imgPath)
                    fs.renameSync(imgPath + '_temp', imgPath)
                  })
              })
              .then(() => {
                const img: ImageType = {
                  path: `public/images/upload/vehicle/${user._id}/${file.filename}`,
                  type: file.mimetype,
                  url: `${process.env.APP_URL}/images/upload/vehicle/${user._id}/${file.filename}`,
                  size: file.size
                }
                resolve(img)
              })
          })
          .catch((err) => {
            console.error('Lỗi khi xử lý hình ảnh:', err)
            reject(err)
          })
      })
  )

  try {
    const preview = await Promise.all(processPromises)
    req.preview = preview
    next()
  } catch (error) {
    console.error('Lỗi xử lý hình ảnh:', error)
    next(error)
  }
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

  await Promise.all(promises)
}

export const updateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  checkSchema(
    {
      vehicle_id: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const user = (req as Request).user as User

            if (user.permission === UserPermission.ADMINISTRATOR) {
              const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(value) })

              if (vehicle === null) {
                throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
              }

              return true
            } else {
              const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(value), user: user._id })

              if (vehicle === null) {
                throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
              }

              return true
            }
          }
        }
      },
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
            throw new Error(VEHICLE_MESSGAE.VEHICLE_TYPE_IS_INVALID)
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
            throw new Error(VEHICLE_MESSGAE.SEAT_TYPE_IS_INVALID)
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
          errorMessage: VEHICLE_MESSGAE.EMAIL_LENGTH_MUST_BE_FROM_10_TO_2000
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
        },
        custom: {
          options: async (value, { req }) => {
            const vehicle = await databaseService.vehicles.findOne({
              license_plate: value,
              _id: { $ne: new ObjectId(req.body.vehicle_id) }
            })

            if (vehicle !== null) {
              throw new Error(VEHICLE_MESSGAE.LICENSE_PLATE_IS_ALREADY_EXISTS)
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
        res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({ message: errors.mapped(), authenticate })
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

export const vehicleIdValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }
  checkSchema(
    {
      vehicle_id: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage: VEHICLE_MESSGAE.VEHICLE_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const user = (req as Request).user as User
            if (user.permission == UserPermission.ADMINISTRATOR) {
              const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(value) })

              if (vehicle === null) {
                throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
              }

              ;(req as Request).vehicle = vehicle
              return true
            } else {
              const vehicle = await databaseService.vehicles.findOne({ _id: new ObjectId(value), user: user._id })

              if (vehicle === null) {
                throw new Error(VEHICLE_MESSGAE.VEHICLE_ID_IS_NOT_EXIST)
              }

              ;(req as Request).vehicle = vehicle
              return true
            }
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

export const getVehicleValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }
  checkSchema(
    {
      current: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.CURRENT_IS_REQUIRED
        },
        isInt: {
          errorMessage: VEHICLE_MESSGAE.CURRENT_IS_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(VEHICLE_MESSGAE.CURRENT_IS_MUST_BE_GREATER_THAN_0)
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

export const findVehicleValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }
  checkSchema(
    {
      keywords: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.KEYWORDS_IS_REQUIRED
        },
        trim: true
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

export const censorVehicleValidator = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }
  checkSchema(
    {
      decision: {
        notEmpty: {
          errorMessage: VEHICLE_MESSGAE.DECISION_IS_REQUIRED
        },
        isBoolean: {
          errorMessage: VEHICLE_MESSGAE.DECISION_IS_MUST_BE_A_BOOLEAN
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
