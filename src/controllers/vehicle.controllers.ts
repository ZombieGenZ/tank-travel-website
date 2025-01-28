import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { VEHICLE_MESSGAE } from '~/constants/message'
import {
  GetVehicleInfoRequestBody,
  CreateVehicleRequestBody,
  UpdateVehicleRequestBody,
  VehicleIdRequestBody,
  GetVehicleRequestBody,
  FindVehicleRequestBody,
  CensorVehicleRequestBody
} from '~/models/requests/vehicle.requests'
import User from '~/models/schemas/users.schemas'
import { Vehicle, VehicleImage } from '~/models/schemas/vehicle.chemas'
import vehicleService from '~/services/vehicle.services'
import VehicleService from '~/services/vehicle.services'

export const getVehicleType = async (req: Request<ParamsDictionary, any, GetVehicleInfoRequestBody>, res: Response) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }
  const vehicleType = [
    { display: 'Xe khách', value: 0 },
    { display: 'Tàu hoả', value: 1 },
    { display: 'Máy bay', value: 2 }
  ]

  res.json({
    vehicleType,
    authenticate
  })
}

export const getSeatType = async (req: Request<ParamsDictionary, any, GetVehicleInfoRequestBody>, res: Response) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }
  const seatType = [
    { display: 'Ghế ngồi', value: 0 },
    { display: 'Giường nằm', value: 1 },
    { display: 'Ghế vừa nằm vừa ngồi', value: 2 }
  ]

  res.json({
    seatType,
    authenticate
  })
}

export const createController = async (
  req: Request<ParamsDictionary, any, CreateVehicleRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const user_id = user._id
  const preview = req.preview as VehicleImage[]
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await VehicleService.createVehicle(req.body, user_id, preview)

  res.json({
    message: VEHICLE_MESSGAE.CREATE_VEHICLE_SUCCESS,
    authenticate
  })
}

export const updateController = async (
  req: Request<ParamsDictionary, any, UpdateVehicleRequestBody>,
  res: Response
) => {
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  vehicleService.updateVehicle(req.body)

  res.json({
    message: VEHICLE_MESSGAE.UPDATE_VEHICLE_SUCCESS,
    authenticate
  })
}

export const deleteController = async (req: Request<ParamsDictionary, any, VehicleIdRequestBody>, res: Response) => {
  const vehicle = req.vehicle as Vehicle
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await VehicleService.deleteVehicle(vehicle)

  res.json({
    message: VEHICLE_MESSGAE.DELETE_VEHICLE_SUCCESS,
    authenticate
  })
}

export const getVehicleController = async (
  req: Request<ParamsDictionary, any, GetVehicleRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await vehicleService.getVehicle(req.body, user)

  res.json({
    result,
    authenticate
  })
}

export const findVehicleController = async (
  req: Request<ParamsDictionary, any, FindVehicleRequestBody>,
  res: Response
) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await vehicleService.findVehicle(req.body, user)

  res.json({
    result,
    authenticate
  })
}

export const getVehiclePreviewController = async (
  req: Request<ParamsDictionary, any, VehicleIdRequestBody>,
  res: Response
) => {
  const vehicle = req.vehicle as Vehicle
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  const result = await VehicleService.getVehiclePreview(vehicle)

  res.json({
    result,
    authenticate
  })
}

export const censorVehicleController = async (
  req: Request<ParamsDictionary, any, CensorVehicleRequestBody>,
  res: Response
) => {
  const vehicle = req.vehicle as Vehicle
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await vehicleService.censorVehicle(req.body, vehicle)

  res.json({
    authenticate
  })
}
