import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { UserPermission } from '~/constants/enum'
import HTTPSTATUS from '~/constants/httpStatus'
import { AUTHENTICATION_MESSAGE, NOTIFICATION_MESSAGE, SYSTEM_MESSAGE } from '~/constants/message'
import { TokenPayload } from '~/models/requests/user.requests'
import User from '~/models/schemas/users.schemas'
import databaseService from '~/services/database.services'
import userService from '~/services/user.services'
import { verifyToken } from '~/utils/jwt'
import fs from 'fs'
import { checkSchema, validationResult } from 'express-validator'
import { promisify } from 'util'
import path from 'path'
import { ImageType } from '~/constants/image'

export const authenticateNotificationGlobalValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  const { refresh_token } = req.body

  if (!authorization || typeof authorization !== 'string' || authorization === '' || !authorization.split(' ')[1]) {
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
      await userService.changeRefreshToken(refresh_token, new_refresh_token)

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
      await userService.changeRefreshToken(refresh_token, new_refresh_token)

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

  if (user && user.permission == UserPermission.ADMINISTRATOR) {
    next()
    return
  }

  deleteTemporaryFile(req.files)
  res.status(HTTPSTATUS.FORBIDDEN).json({
    messgae: AUTHENTICATION_MESSAGE.NOT_PERMISSION_TODO_THIS,
    authenticate
  })
}

export const setNotificationGlobalValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  if (!req.files || !Array.isArray(req.files) || req.files.length < 1) {
    res.json({
      message: NOTIFICATION_MESSAGE.IMAGE_IS_REQUIRED,
      authenticate
    })
    return
  }

  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: NOTIFICATION_MESSAGE.TITLE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: NOTIFICATION_MESSAGE.TITLE_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 5,
            max: 200
          },
          errorMessage: NOTIFICATION_MESSAGE.TITLE_LENGTH_MUST_BE_FROM_5_TO_200
        }
      },
      description: {
        notEmpty: {
          errorMessage: NOTIFICATION_MESSAGE.DESCRIPTION_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage: NOTIFICATION_MESSAGE.DESCRIPTION_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 5,
            max: 200
          },
          errorMessage: NOTIFICATION_MESSAGE.DESCRIPTION_LENGTH_MUST_BE_FROM_5_TO_2000
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
        res
          .status(HTTPSTATUS.UNPROCESSABLE_ENTITY)
          .json({ message: SYSTEM_MESSAGE.VALIDATION_ERROR, errors: errors.mapped(), authenticate })
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

export const setupNotificationGlobal = async (req: Request, res: Response, next: NextFunction) => {
  const directoryPath = path.join(__dirname, '../../public/images/upload/notification')
  const readdir = promisify(fs.readdir)
  const stat = promisify(fs.stat)
  const unlink = promisify(fs.unlink)

  try {
    const items = await readdir(directoryPath)

    for (const item of items) {
      const fullPath = path.join(directoryPath, item)
      const stats = await stat(fullPath)

      if (stats.isFile()) {
        await unlink(fullPath)
      }
    }
  } catch (error) {
    console.error('Lỗi khi xóa files:', error)
    throw error
  }

  const images = req.files as Express.Multer.File[]

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

  const processPromises = images.map((file: Express.Multer.File) => {
    return {
      path: `public/images/upload/notification/${file.filename}`,
      type: file.mimetype,
      url: `${process.env.IMAGE_URL}/images/upload/notification/${file.filename}`,
      size: file.size
    } as ImageType
  })

  try {
    const notification_image = await Promise.all(processPromises)
    req.notification_image = notification_image
    next()
  } catch (error) {
    console.error('Lỗi xử lý hình ảnh:', error)
    next(error)
  }
}

const deleteTemporaryFile = async (files: any) => {
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
