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
import BusRoute from '~/models/schemas/busRoute.schemas'
import User from '~/models/schemas/users.schemas'
import BusRouteService from '~/services/busRoute.services'
import { writeInfoLog, writeErrorLog } from '~/utils/log'

export const createController = async (
  req: Request<ParamsDictionary, any, CreateBusRouteRequestBody>,
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
    await BusRouteService.createBusRoute(req.body)

    await writeInfoLog(`Thực hiện thêm thông tin tuyến thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      message: BUSROUTE_MESSAGE.CREATE_BUS_ROUTE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện thêm thông tin tuyến thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: BUSROUTE_MESSAGE.CREATE_BUS_ROUTE_FAILURE,
      authenticate
    })
  }
}

export const updateController = async (
  req: Request<ParamsDictionary, any, UpdateBusRouteRequestBody>,
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
    await BusRouteService.updateBusRoute(req.body)

    await writeInfoLog(
      `Thực hiện cập nhật thông tin tuyến ${req.body.bus_route_id} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      message: BUSROUTE_MESSAGE.UPDATE_BUS_ROUTE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện cập nhật thông tin tuyến ${req.body.bus_route_id} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: BUSROUTE_MESSAGE.UPDATE_BUS_ROUTE_FAILURE,
      authenticate
    })
  }
}

export const deleteController = async (
  req: Request<ParamsDictionary, any, DeleteBusRouteRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const busRoute = req.bus_route as BusRoute
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await BusRouteService.deleteBusRoute(busRoute)

    await writeInfoLog(
      `Thực hiện xóa thông tin tuyến ${req.body.bus_route_id} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      message: BUSROUTE_MESSAGE.DELETE_BUS_ROUTE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện xóa thông tin tuyến ${req.body.bus_route_id} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: BUSROUTE_MESSAGE.DELETE_BUS_ROUTE_FAILURE,
      authenticate
    })
  }
}

export const getBusRouteController = async (
  req: Request<ParamsDictionary, any, GetBusRouteRequestBody>,
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
    const result = await BusRouteService.getBusRoute(req.body, user)

    await writeInfoLog(`Thực hiện lấy thông tin tuyến thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thông tin tuyến thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: BUSROUTE_MESSAGE.GET_BUS_ROUTE_FAILED,
      authenticate
    })
  }
}

export const findBusRouteController = async (
  req: Request<ParamsDictionary, any, FindBusRouteRequestBody>,
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
    const result = await BusRouteService.findBusRoute(req.body, user)

    await writeInfoLog(`Thực hiện tìm kiếm thông tin tuyến thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện tìm kiếm thông tin tuyến thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: BUSROUTE_MESSAGE.FIND_BUS_ROUTE_FAILED,
      authenticate
    })
  }
}

export const findBusRouteListController = async (
  req: Request<ParamsDictionary, any, FindBusRouteListRequestBody>,
  res: Response
) => {
  const ip = req.ip

  try {
    const result = await BusRouteService.findBusRouteList(req.body)

    await writeInfoLog(`Thực hiện tìm kiếm danh sách các tuyến thành công (IP: ${ip}])`)

    res.json({
      result
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện tìm kiếm danh sách các tuyến thất bại (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: BUSROUTE_MESSAGE.GET_BUS_ROUTE_FAILED
    })
  }
}
