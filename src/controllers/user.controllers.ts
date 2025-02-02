import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USER_MESSAGE } from '~/constants/message'
import {
  LogoutRequestBody,
  RegisterRequestBody,
  EmailVerifyRequestBody,
  SendForgotPasswordRequestBody,
  ForgotPasswordRequestBody,
  TokenPayload,
  ChangePasswordRequestBody,
  SendEmailVerifyChangeEmailRequestBody,
  ChangeEmailRequestBody,
  ChangePhoneRequestBody,
  ChangeAvatarRequestBody
} from '~/models/requests/user.requests'
import User from '~/models/schemas/users.schemas'
import UserServices from '~/services/user.services'
import axios from 'axios'

export const sendEmailController = async (
  req: Request<ParamsDictionary, any, EmailVerifyRequestBody>,
  res: Response
) => {
  await UserServices.sendEmailVerify(req.body)

  res.json({ message: USER_MESSAGE.EMAIL_VERIFY_CODE_SEND_SUCCESS })
}

export const reSendEmailController = async (
  req: Request<ParamsDictionary, any, EmailVerifyRequestBody>,
  res: Response
) => {
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

export const sendEmailForgotPasswordController = async (
  req: Request<ParamsDictionary, any, SendForgotPasswordRequestBody>,
  res: Response
) => {
  const user = req.user as User

  await UserServices.sendEmailForgotPassword(req.body, user)

  res.json({
    message: USER_MESSAGE.FORGOT_PASSWORD_SEND_EMAIL_SUCCESS
  })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload

  await UserServices.forgotPassword(req.body, user_id)

  res.json({
    message: USER_MESSAGE.CHANGED_PASSWORD_SUCCESS
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
  res: Response
) => {
  const user = req.user as User

  await UserServices.changePassword(req.body, user)

  res.json({
    message: USER_MESSAGE.CHANGED_PASSWORD_SUCCESS
  })
}

export const sendEmailVerifyController = async (
  req: Request<ParamsDictionary, any, SendEmailVerifyChangeEmailRequestBody>,
  res: Response
) => {
  const user = req.user as User

  await UserServices.sendEmailVerifyChangeEmail(req.body, user)

  res.json({
    message: USER_MESSAGE.EMAIL_VERIFY_CODE_SEND_SUCCESS
  })
}

export const reSendEmailVerifyController = async (
  req: Request<ParamsDictionary, any, SendEmailVerifyChangeEmailRequestBody>,
  res: Response
) => {
  const user = req.user as User

  await UserServices.reSendEmailVerifyChangeEmail(req.body, user)

  res.json({
    message: USER_MESSAGE.EMAIL_VERIFY_CODE_RESEND_SUCCESS
  })
}

export const changeEmailController = async (
  req: Request<ParamsDictionary, any, ChangeEmailRequestBody>,
  res: Response
) => {
  const user = req.user as User

  await UserServices.changeEmail(req.body, user)

  res.json({
    message: USER_MESSAGE.CHANGED_EMAIL_SUCCESS
  })
}

export const changePhoneController = async (
  req: Request<ParamsDictionary, any, ChangePhoneRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await UserServices.changePhone(req.body, user)

  res.json({
    message: USER_MESSAGE.CHANGED_PHONE_SUCCESS,
    authenticate
  })
}

// export const changeAvatarController = async (
//   req: Request<ParamsDictionary, any, ChangeAvatarRequestBody>,
//   res: Response
// ) => {
//   const user = req.user as User
//   const { access_token, refresh_token } = req
//   const authenticate = {
//     access_token,
//     refresh_token
//   }

//   await UserServices.changePhone(req.body, user)

//   res.json({
//     message: USER_MESSAGE.CHANGED_PHONE_SUCCESS,
//     authenticate
//   })
// }
