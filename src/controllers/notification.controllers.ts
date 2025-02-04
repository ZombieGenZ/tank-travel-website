import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import path from 'path'
import { SetNotificationRequestBody } from '~/models/requests/notification.requests'
import fs from 'fs'
import { NotificationType } from '~/constants/notification'
import User from '~/models/schemas/users.schemas'
import { ImageType } from '~/constants/image'
import { messaging } from 'firebase-admin'
import { NOTIFICATION_MESSAGE } from '~/constants/message'

export const setNotificationController = async (
  req: Request<ParamsDictionary, any, SetNotificationRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const { title, description } = req.body
  const notification_image = req.notification_image as ImageType[]
  const jsonPath = path.join(__dirname, '../../data/notification.json')

  const content: NotificationType = {
    user_id: user._id.toString(),
    display_name: user.display_name,
    title,
    description,
    images: notification_image
  }

  fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2), 'utf8')

  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  res.json({
    message: NOTIFICATION_MESSAGE.SET_NOTIFICATION_SUCCESS,
    authenticate
  })
}

export const removeNotificationController = (req: Request, res: Response) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const jsonPath = path.join(__dirname, '../../data/notification.json')

  fs.unlinkSync(jsonPath)

  res.json({
    message: NOTIFICATION_MESSAGE.REMOVE_NOTIFICATION_SUCCESS,
    authenticate
  })
}

export const getNotificationController = (req: Request, res: Response) => {
  const jsonPath = path.join(__dirname, '../../data/notification.json')

  if (fs.existsSync(jsonPath)) {
    const fileContent = fs.readFileSync(jsonPath, 'utf8')
    res.json(JSON.parse(fileContent))
  } else {
    res.json({
      message: NOTIFICATION_MESSAGE.NOTIFICATION_NOT_FOUND
    })
  }
}
