import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { EVALUATE_MESSAGE } from '~/constants/message'
import {
  CreateEvaluateRequestBody,
  UpdateEvaluateRequestBody,
  DeleteEvaluateRequestBody,
  GetEvaluateRequestBody
} from '~/models/requests/evaluate.requests'
import User from '~/models/schemas/users.schemas'
import EvaluateService from '~/services/evaluate.services'
import Vehicle from './../models/schemas/vehicle.chemas'
import Evaluate from '~/models/schemas/evaluate.schemas'

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

export const updateEvaluateController = async (
  req: Request<ParamsDictionary, any, UpdateEvaluateRequestBody>,
  res: Response
) => {
  const evaluate = req.evaluate as Evaluate
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await EvaluateService.UpdateEvaluate(req.body, evaluate)

  res.json({
    messgae: EVALUATE_MESSAGE.UPDATE_EVALUATE_SUCCESS,
    authenticate
  })
}

export const deleteEvaluateController = async (
  req: Request<ParamsDictionary, any, DeleteEvaluateRequestBody>,
  res: Response
) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await EvaluateService.DeleteEvaluate(req.body)

  res.json({
    messgae: EVALUATE_MESSAGE.DELETE_EVALUATE_SUCCESS,
    authenticate
  })
}

export const getEvaluateController = async (
  req: Request<ParamsDictionary, any, GetEvaluateRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await EvaluateService.GetEvaluate(req.body, user)

  res.json({
    result,
    authenticate
  })
}
