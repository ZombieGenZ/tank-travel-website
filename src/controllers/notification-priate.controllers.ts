import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { NOTIFICATION_PRIATE_MESSAGE } from '~/constants/message'
import { GetNotificatonRequestBody } from '~/models/requests/notification-priate.requests'
import User from '~/models/schemas/users.schemas'
import notificationPrivateService from '~/services/notificationPrivate.services'
import { writeInfoLog, writeErrorLog } from '~/utils/log'

export const geNotificationController = async (
  req: Request<ParamsDictionary, any, GetNotificatonRequestBody>,
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
    const result = await notificationPrivateService.getNotification(req.body, user)

    await writeInfoLog(`Thực hiện lấy thông tin thông báo thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thông tin thông báo thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: NOTIFICATION_PRIATE_MESSAGE.GET_NOTIFICATION_FAILURE,
      authenticate
    })
  }
}
