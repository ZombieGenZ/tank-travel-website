import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { GetStatisticsRequestBody, FindStatisticsRequestBody } from '~/models/requests/statistical.requests'
import User from '~/models/schemas/users.schemas'
import { writeInfoLog, writeErrorLog } from '~/utils/log'
import StatisticalService from '~/services/statistical.services'
import { STATISTICS_MESSAGE } from '~/constants/message'

export const getRevenueStatisticsController = async (
  req: Request<ParamsDictionary, any, GetStatisticsRequestBody>,
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
    const result = await StatisticalService.getRevenueStatistics(user)

    await writeInfoLog(`Thực hiện lấy thống kê doanh thu thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thống kê doanh thu thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const findRevenueStatisticsController = async (
  req: Request<ParamsDictionary, any, FindStatisticsRequestBody>,
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
    const result = await StatisticalService.findRevenueStatistics(req.body, user)

    await writeInfoLog(
      `Thực hiện lấy thống kê doanh thu theo khoản thời gian thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thống kê doanh thu theo khoản thời gian thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const getOrderStatisticsController = async (
  req: Request<ParamsDictionary, any, GetStatisticsRequestBody>,
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
    const result = await StatisticalService.getOrderStatistics(user)

    await writeInfoLog(`Thực hiện lấy thống kê số đơn hàng thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thống kê số đơn hàng thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const findOrderStatisticsController = async (
  req: Request<ParamsDictionary, any, FindStatisticsRequestBody>,
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
    const result = await StatisticalService.findOrderStatistics(req.body, user)

    await writeInfoLog(
      `Thực hiện lấy thống kê số đơn hàng theo khoản thời gian thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thống kê số đơn hàng theo khoản thời gian thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}
