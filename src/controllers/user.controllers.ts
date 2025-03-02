import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { SYSTEM_MESSAGE, USER_MESSAGE } from '~/constants/message'
import {
  LogoutRequestBody,
  RegisterRequestBody,
  EmailVerifyRequestBody,
  ChangeDisplayNameRequestBody,
  SendForgotPasswordRequestBody,
  ForgotPasswordRequestBody,
  TokenPayload,
  ChangePasswordRequestBody,
  SendEmailVerifyChangeEmailRequestBody,
  ChangeEmailRequestBody,
  ChangePhoneRequestBody,
  ChangeAvatarRequestBody,
  ChangePasswordTemporaryRequestBody,
  LoginRequestBody
} from '~/models/requests/user.requests'
import User from '~/models/schemas/users.schemas'
import UserServices from '~/services/user.services'
import { ImageType } from '~/constants/image'
import { omit } from 'lodash'
import { writeInfoLog, writeErrorLog } from '~/utils/log'
import axios from 'axios'

export const sendEmailController = async (
  req: Request<ParamsDictionary, any, EmailVerifyRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string

  try {
    await UserServices.sendEmailVerify(req.body)

    await writeInfoLog(`Thực hiện gửi email xác nhận email đến email ${req.body.email} thành công (IP: ${ip}])`)

    res.json({ message: USER_MESSAGE.EMAIL_VERIFY_CODE_SEND_SUCCESS })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện gửi email xác nhận email đến email ${req.body.email} thất bại (IP: ${ip}]) | Error: ${err}`
    )

    res.json({ message: USER_MESSAGE.EMAIL_VERIFY_CODE_SEND_FAILURE })
  }
}

export const reSendEmailController = async (
  req: Request<ParamsDictionary, any, EmailVerifyRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string

  try {
    await UserServices.reSendEmailVerify(req.body)

    await writeInfoLog(`Thực hiện gửi lại email xác nhận email đến email ${req.body.email} thành công (IP: ${ip}])`)

    res.json({ message: USER_MESSAGE.EMAIL_VERIFY_CODE_RESEND_SUCCESS })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện gửi lại email xác nhận email đến email ${req.body.email} thất bại (IP: ${ip}]) | Error: ${err}`
    )

    res.json({ message: USER_MESSAGE.EMAIL_VERIFY_CODE_RESEND_FAILURE })
  }
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string

  try {
    await UserServices.register(req.body)

    await writeInfoLog(`Thực hiện đăng ký tài khoản ${req.body.email} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.REGISTER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện đăng ký tài khoản ${req.body.email} thất bại (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: USER_MESSAGE.REGISTER_FAILURE
    })
  }
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const user_id = user._id as ObjectId

  try {
    const result = await UserServices.login(user_id.toString())

    await writeInfoLog(`Thực hiện đăng nhập tài khoản ${user_id} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.LOGIN_SUCCESS,
      authenticate: result
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện đăng nhập tài khoản ${user_id} thất bại (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: USER_MESSAGE.LOGIN_FAILURE
    })
  }
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const { decoded_refresh_token } = req

  try {
    const { refresh_token } = req.body

    await UserServices.logout(refresh_token)

    await writeInfoLog(`Thực hiện đăng xuất tài khoản ${decoded_refresh_token?.user_id} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.LOGOUT_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện đăng xuất tài khoản ${decoded_refresh_token?.user_id} thất bại (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: USER_MESSAGE.LOGOUT_FAILURE
    })
  }
}

export const changeDisplayNameController = async (
  req: Request<ParamsDictionary, any, ChangeDisplayNameRequestBody>,
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
    await UserServices.changeDisplayName(req.body, user)

    await writeInfoLog(`Thực hiện thay đổi tên hiển thị cho tài khoản ${user._id} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.CHANGED_DISPLAY_NAME_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện thay đổi tên hiển thị cho tài khoản ${user._id} thất bại (IP: ${ip}]) Error: ${err}`)

    res.json({
      message: USER_MESSAGE.CHANGED_DISPLAY_NAME_FAILURE,
      authenticate
    })
  }
}

export const sendEmailForgotPasswordController = async (
  req: Request<ParamsDictionary, any, SendForgotPasswordRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string

  try {
    const user = req.user as User

    await UserServices.sendEmailForgotPassword(req.body, user)

    await writeInfoLog(`Thực hiện gửi email quên mật khẩu đến email ${req.body.email} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.FORGOT_PASSWORD_SEND_EMAIL_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện gửi email quên mật khẩu đến email ${req.body.email} thất bại (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: USER_MESSAGE.FORGOT_PASSWORD_SEND_EMAIL_FAILURE
    })
  }
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const { user_id } = req.decoded_forgot_password_token as TokenPayload

  try {
    await UserServices.forgotPassword(req.body, user_id)

    await writeInfoLog(
      `Thực hiện đổi mật khẩu bằng token quên mật khẩu cho tài khoản ${user_id} thành công (IP: ${ip}])`
    )

    res.json({
      message: USER_MESSAGE.CHANGED_PASSWORD_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện đổi mật khẩu bằng token quên mật khẩu cho tài khoản ${user_id} thất bại (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: USER_MESSAGE.CHANGED_PASSWORD_FAILURE
    })
  }
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User

  try {
    await UserServices.changePassword(req.body, user)

    await writeInfoLog(`Thực hiện đổi mật khẩu cho tài khoản ${user._id} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.CHANGED_PASSWORD_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện đổi mật khẩu cho tài khoản ${user._id} thất bại (IP: ${ip}]) Error: ${err}`)

    res.json({
      message: USER_MESSAGE.CHANGED_PASSWORD_FAILURE
    })
  }
}

export const sendEmailVerifyController = async (
  req: Request<ParamsDictionary, any, SendEmailVerifyChangeEmailRequestBody>,
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
    await UserServices.sendEmailVerifyChangeEmail(req.body, user)

    await writeInfoLog(
      `Thực hiện gửi mã xác nhận đến email ${req.body.email} để thay đổi địa chỉ email cho tài khoản ${user._id} thành công (IP: ${ip}])`
    )

    res.json({
      message: USER_MESSAGE.EMAIL_VERIFY_CODE_SEND_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện gửi mã xác nhận đến email ${req.body.email} để thay đổi địa chỉ email cho tài khoản ${user._id} thất bại (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: USER_MESSAGE.EMAIL_VERIFY_CODE_SEND_FAILURE,
      authenticate
    })
  }
}

export const reSendEmailVerifyController = async (
  req: Request<ParamsDictionary, any, SendEmailVerifyChangeEmailRequestBody>,
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
    await UserServices.reSendEmailVerifyChangeEmail(req.body, user)

    await writeInfoLog(
      `Thực hiện gửi lại mã xác nhận đến email ${req.body.email} để thay đổi địa chỉ email cho tài khoản ${user._id} thành công (IP: ${ip}])`
    )

    res.json({
      message: USER_MESSAGE.EMAIL_VERIFY_CODE_RESEND_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện gửi lại mã xác nhận đến email ${req.body.email} để thay đổi địa chỉ email cho tài khoản ${user._id} thất bại (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: USER_MESSAGE.EMAIL_VERIFY_CODE_RESEND_FAILURE,
      authenticate
    })
  }
}

export const changeEmailController = async (
  req: Request<ParamsDictionary, any, ChangeEmailRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User

  try {
    await UserServices.changeEmail(req.body, user)

    await writeInfoLog(`Thực hiện thay đổi địa chỉ email cho tài khoản ${user._id} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.CHANGED_EMAIL_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện thay đổi địa chỉ email cho tài khoản ${user._id} thất bại (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: USER_MESSAGE.CHANGED_EMAIL_FAILURE
    })
  }
}

export const changePhoneController = async (
  req: Request<ParamsDictionary, any, ChangePhoneRequestBody>,
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
    await UserServices.changePhone(req.body, user)

    await writeInfoLog(`Thực hiện thay đổi số điện thoại cho tài khoản ${user._id} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.CHANGED_PHONE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện thay đổi số điện thoại cho tài khoản ${user._id} thất bại (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: USER_MESSAGE.CHANGED_PHONE_FAILURE,
      authenticate
    })
  }
}

export const changeAvatarController = async (
  req: Request<ParamsDictionary, any, ChangeAvatarRequestBody>,
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
    const avatar = req.avatar as ImageType

    await UserServices.changeAvatar(user, avatar)

    await writeInfoLog(`Thực hiện thay đổi ảnh đại diện cho tài khoản ${user._id} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.CHANGED_AVATAR_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện thay đổi ảnh đại diện cho tài khoản ${user._id} thất bại (IP: ${ip}]) Error: ${err}`)

    res.json({
      message: USER_MESSAGE.CHANGED_AVATAR_FAILURE,
      authenticate
    })
  }
}

export const setDefaultAvatarController = async (
  req: Request<ParamsDictionary, any, ChangeAvatarRequestBody>,
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
    await UserServices.setDefaultAvatar(user)

    await writeInfoLog(`Thực hiện thay đổi ảnh đại diện về mặc định cho tài khoản ${user._id} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.CHANGED_AVATAR_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện thay đổi ảnh đại diện về mặc định cho tài khoản ${user._id} thất bại (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: USER_MESSAGE.CHANGED_AVATAR_FAILURE,
      authenticate
    })
  }
}

export const changePasswordTemporaryController = async (
  req: Request<ParamsDictionary, any, ChangePasswordTemporaryRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User

  try {
    await UserServices.ChangePasswordTemporary(req.body, user)

    await writeInfoLog(`Thực hiện thay đổi mật khẩu lần đầu cho tài khoản ${user._id} thành công (IP: ${ip}])`)

    res.json({
      message: USER_MESSAGE.CHANGED_TEMPORARY_PASSWORD_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện thay đổi mật khẩu lần đầu cho tài khoản ${user._id} thất bại (IP: ${ip}]) Error: ${err}`
    )

    res.json({
      message: USER_MESSAGE.CHANGED_TEMPORARY_PASSWORD_FAILURE
    })
  }
}

export const getUserInfomationController = async (req: Request, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await writeInfoLog(`Thực hiện lấy thông tin tài khoản ${user._id} thành công (IP: ${ip}])`)

  res.json({
    user: omit(user, ['password', 'forgot_password_token']),
    authenticate
  })
}
