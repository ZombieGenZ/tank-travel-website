import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import path from 'path'
import { SetNotificationRequestBody } from '~/models/requests/notification.requests'
import fs from 'fs'
import { NotificationType } from '~/constants/notification'
import User from '~/models/schemas/users.schemas'
import { ImageType } from '~/constants/image'
import { NOTIFICATION_MESSAGE } from '~/constants/message'
import { writeInfoLog, writeErrorLog } from '~/utils/log'

export const setNotificationGlobalController = async (
  req: Request<ParamsDictionary, any, SetNotificationRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
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

    await writeInfoLog(`Thực hiện đặt thông báo thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      message: NOTIFICATION_MESSAGE.SET_NOTIFICATION_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện đặt thông báo thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      messgae: NOTIFICATION_MESSAGE.SET_NOTIFICATION_FAILED,
      authenticate
    })
  }
}

export const removeNotificationGlobalController = async (req: Request, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const jsonPath = path.join(__dirname, '../../data/notification.json')

    fs.unlinkSync(jsonPath)

    await writeInfoLog(`Thực hiện xóa thông báo thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      message: NOTIFICATION_MESSAGE.REMOVE_NOTIFICATION_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện xóa thông báo thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      messgae: NOTIFICATION_MESSAGE.REMOVE_NOTIFICATION_FAILED,
      authenticate
    })
  }
}

export const getNotificationGlobalController = async (req: Request, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string

  try {
    const jsonPath = path.join(__dirname, '../../data/notification.json')

    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, 'utf8')

      res.json(JSON.parse(fileContent))

      await writeInfoLog(`Thực hiện lấy thông tin thông báo thành công (IP: ${ip}])`)
    } else {
      res.json({
        message: NOTIFICATION_MESSAGE.NOTIFICATION_NOT_FOUND
      })

      await writeInfoLog(`Thực hiện lấy thông tin thông báo thành công (IP: ${ip}])`)
    }
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thông tin thông báo thất bại (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: NOTIFICATION_MESSAGE.GET_NOTIFICATION_FAILED
    })
  }
}
