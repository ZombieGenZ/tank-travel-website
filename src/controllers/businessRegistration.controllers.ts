import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BUSINESS_REGISTRATION_MESSAGE } from '~/constants/message'
import { RegisterRequestBody, CensorRequestBody } from '~/models/requests/businessRegistration.requests'
import BusinessRegistration from '~/models/schemas/businessregistration.schemas'
import BusinessRegistrationService from '~/services/businessRegistration.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  await BusinessRegistrationService.register(req.body)

  res.json({
    message: BUSINESS_REGISTRATION_MESSAGE.REGISTER_SUCCESS
  })
}

export const censorController = async (req: Request<ParamsDictionary, any, CensorRequestBody>, res: Response) => {
  const businessRegistration = req.business_registration as BusinessRegistration
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await BusinessRegistrationService.censor(req.body, businessRegistration)

  res.json({
    message: BUSINESS_REGISTRATION_MESSAGE.CENSOR_SUCCESS,
    authenticate
  })
}

export const getBusinessRegistrationController = async (req: Request, res: Response) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await BusinessRegistrationService.getBusinessRegistration(req.body)

  res.json({
    result,
    authenticate
  })
}
