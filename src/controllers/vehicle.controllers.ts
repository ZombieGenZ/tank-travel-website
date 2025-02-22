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
  CensorVehicleRequestBody,
  GetVehicleListRequestBody
} from '~/models/requests/vehicle.requests'
import User from '~/models/schemas/users.schemas'
import Vehicle from '~/models/schemas/vehicle.chemas'
import { ImageType } from '~/constants/image'
import VehicleService from '~/services/vehicle.services'
import { writeInfoLog, writeErrorLog } from '~/utils/log'

export const getVehicleType = async (req: Request<ParamsDictionary, any, GetVehicleInfoRequestBody>, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
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

  await writeInfoLog(`Thực hiện lấy thông tin các loại phương tiện thành công (IP: ${ip}])`)

  res.json({
    vehicleType,
    authenticate
  })
}

export const getSeatType = async (req: Request<ParamsDictionary, any, GetVehicleInfoRequestBody>, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
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

  await writeInfoLog(`Thực hiện lấy thông tin các loại chổ ngồi thành công (IP: ${ip}])`)

  res.json({
    seatType,
    authenticate
  })
}

export const createController = async (
  req: Request<ParamsDictionary, any, CreateVehicleRequestBody>,
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
    const preview = req.preview as ImageType[]

    await VehicleService.createVehicle(req.body, user, preview)

    await writeInfoLog(`Thực hiện tạo thông tin phương tiện thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      message: VEHICLE_MESSGAE.CREATE_VEHICLE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện tạo thông tin phương tiện thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: VEHICLE_MESSGAE.CREATE_VEHICLE_FAILURE,
      authenticate
    })
  }
}

export const updateController = async (
  req: Request<ParamsDictionary, any, UpdateVehicleRequestBody>,
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
    VehicleService.updateVehicle(req.body)

    await writeInfoLog(
      `Thực hiện cập nhật thông tin phương tiện ${req.body.vehicle_id} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      message: VEHICLE_MESSGAE.UPDATE_VEHICLE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện cập nhật thông tin phương tiện ${req.body.vehicle_id} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: VEHICLE_MESSGAE.UPDATE_VEHICLE_FAILURE,
      authenticate
    })
  }
}

export const deleteController = async (req: Request<ParamsDictionary, any, VehicleIdRequestBody>, res: Response) => {
  const ip = req.io
  const user = req.user as User
  const vehicle = req.vehicle as Vehicle
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await VehicleService.deleteVehicle(vehicle)

    await writeInfoLog(`Thực hiện xóa thông tin phương tiện ${vehicle._id} thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      message: VEHICLE_MESSGAE.DELETE_VEHICLE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện xóa thông tin phương tiện ${vehicle._id} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: VEHICLE_MESSGAE.DELETE_VEHICLE_FAILURE,
      authenticate
    })
  }
}

export const getVehicleController = async (
  req: Request<ParamsDictionary, any, GetVehicleRequestBody>,
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
    const result = await VehicleService.getVehicle(req.body, user)

    await writeInfoLog(`Thực hiện lấy thông tin phương tiện thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thông tin phương tiện thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: VEHICLE_MESSGAE.GET_VEHICLE_FAILURE,
      authenticate
    })
  }
}

export const findVehicleController = async (
  req: Request<ParamsDictionary, any, FindVehicleRequestBody>,
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
    const result = await VehicleService.findVehicle(req.body, user)

    await writeInfoLog(
      `Thực hiện tìm kiếm thông tin phương tiện thành công (Keyword: ${req.body.keywords}) (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện tìm kiếm thông tin phương tiện thất bại (Keyword: ${req.body.keywords}) (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: VEHICLE_MESSGAE.FIND_VEHICLE_FAILURE,
      authenticate
    })
  }
}

export const getVehiclePreviewController = async (
  req: Request<ParamsDictionary, any, VehicleIdRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const vehicle = req.vehicle as Vehicle
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await VehicleService.getVehiclePreview(vehicle)

    await writeInfoLog(
      `Thực hiện lấy thông tin ảnh giới thiệu của phương tiện ${vehicle._id} thành công (User: ${vehicle.user}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thông tin ảnh giới thiệu của phương tiện ${vehicle._id} thất bại (User: ${vehicle.user}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: VEHICLE_MESSGAE.GET_VEHICLE_FAILURE,
      authenticate
    })
  }
}

export const censorVehicleController = async (
  req: Request<ParamsDictionary, any, CensorVehicleRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const vehicle = req.vehicle as Vehicle
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await VehicleService.censorVehicle(req.body, vehicle)

    await writeInfoLog(`Thực hiện duyệt phương tiện ${vehicle._id} thành công (User: ${vehicle.user}) (IP: ${ip}])`)

    res.json({
      message: VEHICLE_MESSGAE.CENSOR_VEHICLE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện duyệt phương tiện ${vehicle._id} thất bại (User: ${vehicle.user}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: VEHICLE_MESSGAE.CENSOR_VEHICLE_FAILURE,
      authenticate
    })
  }
}

export const getVehicleListController = async (
  req: Request<ParamsDictionary, any, GetVehicleListRequestBody>,
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
    const result = await VehicleService.getVehicleList(user)

    await writeInfoLog(`Thực hiện lấy thông tin id và tên phương tiện thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thông tin id và tên phương tiện thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: VEHICLE_MESSGAE.GET_VEHICLE_LIST_FAILURE,
      authenticate
    })
  }
}

export const getVehicleRegistrationController = async (
  req: Request<ParamsDictionary, any, GetVehicleRequestBody>,
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
    const result = await VehicleService.getVehicleRegistration(req.body)

    await writeInfoLog(`Thực hiện lấy thông tin phương tiện đang chờ duyệt thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thông tin phương tiện đang chờ duyệt thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: VEHICLE_MESSGAE.GET_VEHICLE_FAILURE,
      authenticate
    })
  }
}
