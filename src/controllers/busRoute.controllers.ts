import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BUSROUTE_MESSAGE } from '~/constants/message'
import {
  CreateBusRouteRequestBody,
  DeleteBusRouteRequestBody,
  FindBusRouteListRequestBody,
  FindBusRouteRequestBody,
  GetBusRouteRequestBody,
  UpdateBusRouteRequestBody
} from '~/models/requests/busRoute.requests'
import User from '~/models/schemas/users.schemas'
import BusRouteService from '~/services/busRoute.services'

export const createController = async (
  req: Request<ParamsDictionary, any, CreateBusRouteRequestBody>,
  res: Response
) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await BusRouteService.createBusRoute(req.body)

  res.json({
    message: BUSROUTE_MESSAGE.CREATE_BUS_ROUTE_SUCCESS,
    authenticate
  })
}

export const updateController = async (
  req: Request<ParamsDictionary, any, UpdateBusRouteRequestBody>,
  res: Response
) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await BusRouteService.updateBusRoute(req.body)

  res.json({
    message: BUSROUTE_MESSAGE.UPDATE_BUS_ROUTE_SUCCESS,
    authenticate
  })
}

export const deleteController = async (
  req: Request<ParamsDictionary, any, DeleteBusRouteRequestBody>,
  res: Response
) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await BusRouteService.deleteBusRoute(req.body)

  res.json({
    message: BUSROUTE_MESSAGE.DELETE_BUS_ROUTE_SUCCESS,
    authenticate
  })
}

export const getBusRouteController = async (
  req: Request<ParamsDictionary, any, GetBusRouteRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await BusRouteService.getBusRoute(req.body, user)

  res.json({
    result,
    authenticate
  })
}

export const findBusRouteController = async (
  req: Request<ParamsDictionary, any, FindBusRouteRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await BusRouteService.findBusRoute(req.body, user)

  res.json({
    result,
    authenticate
  })
}

export const findBusRouteListController = async (
  req: Request<ParamsDictionary, any, FindBusRouteListRequestBody>,
  res: Response
) => {
  const result = await BusRouteService.findBusRouteList(req.body)

  res.json({
    result
  })
}
