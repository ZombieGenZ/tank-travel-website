import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BUSINESS_REGISTRATION_MESSAGE } from '~/constants/message'
import { RegisterRequestBody, CensorRequestBody } from '~/models/requests/businessRegistration.requests'
import BusinessRegistration from '~/models/schemas/businessregistration.schemas'
import User from '~/models/schemas/users.schemas'
import BusinessRegistrationService from '~/services/businessRegistration.services'
import { writeInfoLog, writeErrorLog } from '~/utils/log'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string

  try {
    await BusinessRegistrationService.register(req.body)

    await writeInfoLog(`Thực hiện đăng ký doanh nghiệp thành công (IP: ${ip}])`)

    res.json({
      message: BUSINESS_REGISTRATION_MESSAGE.REGISTER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện đăng ký doanh nghiệp thất bại (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: BUSINESS_REGISTRATION_MESSAGE.REGISTER_FAILED
    })
  }
}

export const censorController = async (req: Request<ParamsDictionary, any, CensorRequestBody>, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const businessRegistration = req.business_registration as BusinessRegistration
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await BusinessRegistrationService.censor(req.body, businessRegistration)

    await writeInfoLog(
      `Thực hiện duyệt đơn đăng ký doanh nghiệp ${req.body.business_registration_id} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      message: BUSINESS_REGISTRATION_MESSAGE.CENSOR_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện duyệt đơn đăng ký doanh nghiệp ${req.body.business_registration_id} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: BUSINESS_REGISTRATION_MESSAGE.CENSOR_FAILED,
      authenticate
    })
  }
}

export const getBusinessRegistrationController = async (req: Request, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await BusinessRegistrationService.getBusinessRegistration(req.body)

    await writeInfoLog(
      `Thực hiện lấy thông tin các đơn đăng ký doanh nghiệp thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thông tin các đơn đăng ký doanh nghiệp thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: BUSINESS_REGISTRATION_MESSAGE.GET_BUSINESS_REGISTRATION__FAILED,
      authenticate
    })
  }
}
