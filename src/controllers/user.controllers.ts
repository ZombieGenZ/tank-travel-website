import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import HTTPSTATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { LogoutRequestBody, RegisterRequestBody, TokenPayload } from '~/models/requests/user.requests'
import User from '~/models/schemas/users.schemas'
import databaseService from '~/services/database.services'
import UserServices from '~/services/user.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await UserServices.register(req.body)

  res.json({
    message: USER_MESSAGE.REGISTER_SUCCESS,
    result
  })
}

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId

  const result = await UserServices.login(user_id.toString())

  res.json({
    message: USER_MESSAGE.LOGIN_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body

  await UserServices.logout(refresh_token)

  res.json({
    message: USER_MESSAGE.LOGOUT_SUCCESS
  })
}

export const emailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: USER_MESSAGE.EMAIL_VERIFY_TOKEN_DOES_NOT_EXIST })
    return
  }

  if (user.email_verify_token === '') {
    res.json({ message: USER_MESSAGE.EMAIL_ALREADY_VERIFIED })
    return
  }

  const result = await UserServices.verifyEmail(user_id)

  res.json({
    message: USER_MESSAGE.EMAIL_VERIFY_SUSSCESS,
    result
  })
}
