import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USER_MESSAGE } from '~/constants/message'
import { LogoutRequestBody, RegisterRequestBody, EmailVerifyBody, TokenPayload } from '~/models/requests/user.requests'
import User from '~/models/schemas/users.schemas'
import UserServices from '~/services/user.services'

export const sendEmailController = async (req: Request<ParamsDictionary, any, EmailVerifyBody>, res: Response) => {
  await UserServices.sendEmailVerify(req.body)

  res.json({ message: USER_MESSAGE.EMAIL_SENDIING_SUCCESS })
}

export const reSendEmailController = async (req: Request<ParamsDictionary, any, EmailVerifyBody>, res: Response) => {
  await UserServices.reSendEmailVerify(req.body)

  res.json({ message: USER_MESSAGE.EMAIL_VERIFY_CODE_RESEND_SUCCESS })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  await UserServices.register(req.body)

  res.json({
    message: USER_MESSAGE.REGISTER_SUCCESS
  })
}

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId

  const result = await UserServices.login(user_id.toString())

  res.json({
    message: USER_MESSAGE.LOGIN_SUCCESS,
    authenticate: result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body

  await UserServices.logout(refresh_token)

  res.json({
    message: USER_MESSAGE.LOGOUT_SUCCESS
  })
}
