import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { EVALUATE_MESSAGE } from '~/constants/message'
import { CreateEvaluateRequestBody } from '~/models/requests/evaluate.requests'
import User from '~/models/schemas/users.schemas'
import EvaluateService from '~/services/evaluate.services'
import { Vehicle } from './../models/schemas/vehicle.chemas'

export const createEvaluateController = async (
  req: Request<ParamsDictionary, any, CreateEvaluateRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const vehicle = req.vehicle as Vehicle
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await EvaluateService.CreateEvaluate(req.body, user, vehicle)

  res.json({
    messgae: EVALUATE_MESSAGE.CREATE_EVALUATE_SUCCESS,
    authenticate
  })
}
