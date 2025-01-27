import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { VEHICLE_MESSGAE } from '~/constants/message'
import { CreateVehicleReqúetBody, DeleteVehicleReqúetBody } from '~/models/requests/vehicle.requests'
import User from '~/models/schemas/users.schemas'
import { Vehicle, VehicleImage } from '~/models/schemas/vehicle.chemas'
import VehicleService from '~/services/vehicle.services'

export const createController = async (req: Request<ParamsDictionary, any, CreateVehicleReqúetBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id
  const preview = req.preview as VehicleImage[]
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await VehicleService.create(req.body, user_id, preview)

  res.json({
    message: VEHICLE_MESSGAE.CREATE_VEHICLE_SUCCESS,
    authenticate
  })
}

export const deleteController = async (req: Request<ParamsDictionary, any, DeleteVehicleReqúetBody>, res: Response) => {
  const vehicle = req.vehicle as Vehicle
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  await VehicleService.delete(vehicle)

  res.json({
    message: VEHICLE_MESSGAE.DELETE_VEHICLE_SUCCESS,
    authenticate
  })
}
