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
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
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
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
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
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await StatisticalService.getOrderStatistics(user)

    await writeInfoLog(`Thực hiện lấy thống kê số vé thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thống kê số vé thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

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
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await StatisticalService.findOrderStatistics(req.body, user)

    await writeInfoLog(`Thực hiện lấy thống kê số vé theo khoản thời gian thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thống kê số vé theo khoản thời gian thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const getDealtatisticsController = async (
  req: Request<ParamsDictionary, any, GetStatisticsRequestBody>,
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
    const result = await StatisticalService.getDealStatistics(user)

    await writeInfoLog(`Thực hiện lấy thống kê số đơn thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thống kê số đơn thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const findDealStatisticsController = async (
  req: Request<ParamsDictionary, any, FindStatisticsRequestBody>,
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
    const result = await StatisticalService.findDealStatistics(req.body, user)

    await writeInfoLog(`Thực hiện lấy thống kê số đơn theo khoản thời gian thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thống kê số đơn theo khoản thời gian thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const getChartRevenueStatisticsController = async (
  req: Request<ParamsDictionary, any, GetStatisticsRequestBody>,
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
    const result = await StatisticalService.getChartRevenueStatistics(user)

    await writeInfoLog(
      `Thực hiện lấy tổng quan thông tin doanh thu 7 ngày qua thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy tổng quan thông tin doanh thu 7 ngày qua thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const getTopRevenueStatisticsController = async (
  req: Request<ParamsDictionary, any, GetStatisticsRequestBody>,
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
    const result = await StatisticalService.getTopRevenueStatistics()

    await writeInfoLog(
      `Thực hiện lấy thống kê TOP doanh thu trong 7 ngày qua thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thống kê TOP doanh thu trong 7 ngày qua thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const getCompareDealsStatisticsController = async (
  req: Request<ParamsDictionary, any, GetStatisticsRequestBody>,
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
    const result = await StatisticalService.getCompareDealsStatistics(user)

    await writeInfoLog(
      `Thực hiện lấy thông tin sự thay đổi về số đơn hàng đã đặt giửa ngày hôm nay và ngày hôm qua thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thông tin sự thay đổi về số đơn hàng đã đặt giửa ngày hôm nay và ngày hôm qua thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const getCompaRerevenueStatisticsController = async (
  req: Request<ParamsDictionary, any, GetStatisticsRequestBody>,
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
    const result = await StatisticalService.getCompareRevenueStatistics(user)

    await writeInfoLog(
      `Thực hiện lấy thông tin sự thay đổi về số doanh thu đã nhận giửa ngày hôm nay và ngày hôm qua thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thông tin sự thay đổi về số doanh thu đã nhận giửa ngày hôm nay và ngày hôm qua thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const getCompaTicketStatisticsController = async (
  req: Request<ParamsDictionary, any, GetStatisticsRequestBody>,
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
    const result = await StatisticalService.getCompareTicketStatistics(user)

    await writeInfoLog(
      `Thực hiện lấy thông tin sự thay đổi về số vé đã bán giửa ngày hôm nay và ngày hôm qua thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thông tin sự thay đổi về số vé đã bán giửa ngày hôm nay và ngày hôm qua thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}

export const getTodayStatisticsController = async (
  req: Request<ParamsDictionary, any, GetStatisticsRequestBody>,
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
    const result = await StatisticalService.getTodayStatistics(user)

    await writeInfoLog(
      `Thực hiện lấy thông tin số đơn hàng, số vé đã bán và số doanh thu trong ngày thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thông tin số đơn hàng, số vé đã bán và số doanh thu trong ngày thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      message: STATISTICS_MESSAGE.GET_STATISTICS_FAILURE,
      authenticate
    })
  }
}
