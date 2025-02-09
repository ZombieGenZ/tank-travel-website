import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  GetAccountRequestBody,
  FindAccountRequestBody,
  BanAccountRequestBody,
  UnBanAccountRequestBody
} from '~/models/requests/accountManagement.requests'
import User from '~/models/schemas/users.schemas'
import { writeInfoLog, writeErrorLog } from '~/utils/log'
import AccountmManagementService from '~/services/accountManagement.services'
import { ACCOUNT_MANAGEMENT_MESSAGE } from '~/constants/message'

export const getAccountController = async (
  req: Request<ParamsDictionary, any, GetAccountRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await AccountmManagementService.getAccount(req.body)

    await writeInfoLog(`Thực hiện lấy danh sách tất cả tài khoản thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy danh sách tất cả tài khoản thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: ACCOUNT_MANAGEMENT_MESSAGE.GET_ACCOUNT_FAILURE,
      authenticate
    })
  }
}

export const findAccountController = async (
  req: Request<ParamsDictionary, any, FindAccountRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await AccountmManagementService.findAccount(req.body)

    await writeInfoLog(
      `Thực hiện tìm kiếm tài khoản thành công (Keyword: ${req.body.keywords}) (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện tìm kiếm tài khoản thất bại (Keyword: ${req.body.keywords}) (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: ACCOUNT_MANAGEMENT_MESSAGE.FIND_ACCOUNT_FAILURE,
      authenticate
    })
  }
}

export const banAccountController = async (
  req: Request<ParamsDictionary, any, BanAccountRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await AccountmManagementService.banAccount(req.body, user)

    await writeInfoLog(`Thực hiện khóa tài khoản ${req.body.user_id} thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      message: ACCOUNT_MANAGEMENT_MESSAGE.BAN_ACCOUNT_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện khóa tài khoản ${req.body.user_id} (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      messgae: ACCOUNT_MANAGEMENT_MESSAGE.BAN_ACCOUNT_FAILURE,
      authenticate
    })
  }
}

export const unBanAccountController = async (
  req: Request<ParamsDictionary, any, UnBanAccountRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await AccountmManagementService.unBanAccount(req.body.user_id)

    await writeInfoLog(`Thực hiện mở khóa tài khoản ${req.body.user_id} thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      message: ACCOUNT_MANAGEMENT_MESSAGE.UNBAN_ACCOUNT_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện khóa tài khoản ${req.body.user_id} (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      messgae: ACCOUNT_MANAGEMENT_MESSAGE.UNBAN_ACCOUNT_FAILURE,
      authenticate
    })
  }
}
