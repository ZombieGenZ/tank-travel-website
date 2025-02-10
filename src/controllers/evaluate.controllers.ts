import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { EVALUATE_MESSAGE } from '~/constants/message'
import {
  CreateEvaluateRequestBody,
  UpdateEvaluateRequestBody,
  DeleteEvaluateRequestBody,
  GetEvaluateRequestBody,
  CreateFeedbackRequestBody,
  UpdateFeedbackRequestBody,
  DeleteFeedbackRequestBody,
  GetEvaluateListRequestBody
} from '~/models/requests/evaluate.requests'
import User from '~/models/schemas/users.schemas'
import EvaluateService from '~/services/evaluate.services'
import Vehicle from './../models/schemas/vehicle.chemas'
import Evaluate from '~/models/schemas/evaluate.schemas'
import { writeInfoLog, writeErrorLog } from '~/utils/log'

export const createEvaluateController = async (
  req: Request<ParamsDictionary, any, CreateEvaluateRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const vehicle = req.vehicle as Vehicle
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await EvaluateService.CreateEvaluate(req.body, user, vehicle)

    await writeInfoLog(
      `Thực hiện thêm thông tin đánh giá cho phương tiện ${vehicle._id} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.CREATE_EVALUATE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện thêm thông tin đánh giá cho phương tiện ${vehicle._id} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.CREATE_EVALUATE_FAILURE,
      authenticate
    })
  }
}

export const updateEvaluateController = async (
  req: Request<ParamsDictionary, any, UpdateEvaluateRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const evaluate = req.evaluate as Evaluate
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await EvaluateService.UpdateEvaluate(req.body, evaluate)

    await writeInfoLog(
      `Thực hiện cập nhật thông tin đánh giá ${evaluate._id} của phương tiện ${evaluate.vehicle} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.UPDATE_EVALUATE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện cập nhật thông tin đánh giá ${evaluate._id} của phương tiện ${evaluate.vehicle} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.UPDATE_EVALUATE_FAILURE,
      authenticate
    })
  }
}

export const deleteEvaluateController = async (
  req: Request<ParamsDictionary, any, DeleteEvaluateRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const evaluate = req.evaluate as Evaluate
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await EvaluateService.DeleteEvaluate(req.body)

    await writeInfoLog(
      `Thực hiện xóa thông tin đánh giá ${req.body.evaluate_id} của phương tiện ${evaluate.vehicle} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.DELETE_EVALUATE_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện xóa thông tin đánh giá ${req.body.evaluate_id} của phương tiện ${evaluate.vehicle} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.DELETE_EVALUATE_FAILURE,
      authenticate
    })
  }
}

export const getEvaluateController = async (
  req: Request<ParamsDictionary, any, GetEvaluateRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const evaluate = req.evaluate as Evaluate
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    const result = await EvaluateService.GetEvaluate(req.body, user)

    await writeInfoLog(`Thực hiện lấy thông tin đánh giá thành công (User: ${user._id}) (IP: ${ip}])`)

    res.json({
      result,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(`Thực hiện lấy thông tin đánh giá thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`)

    res.json({
      messgae: EVALUATE_MESSAGE.GET_EVALUATE_FAILURE,
      authenticate
    })
  }
}

export const createFeedbackController = async (
  req: Request<ParamsDictionary, any, CreateFeedbackRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const evaluate = req.evaluate as Evaluate
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await EvaluateService.CreateFeedback(req.body, user, evaluate)

    await writeInfoLog(
      `Thực hiện thêm thông tin phàn hồi đánh giá cho phương tiện ${evaluate.vehicle} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      message: EVALUATE_MESSAGE.CREATE_EVALUATE_FEEDBACK_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện thêm thông tin phàn hồi đánh giá cho phương tiện ${evaluate.vehicle} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.CREATE_EVALUATE_FEEDBACK_FAILURE,
      authenticate
    })
  }
}

export const updateFeedbackController = async (
  req: Request<ParamsDictionary, any, UpdateFeedbackRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const evaluate = req.evaluate as Evaluate
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await EvaluateService.UpdateFeedback(req.body, user, evaluate)

    await writeInfoLog(
      `Thực hiện cập nhật thông tin phàn hồi đánh ${evaluate._id} giá cho phương tiện ${evaluate.vehicle} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      message: EVALUATE_MESSAGE.UPDATE_EVALUATE_FEEDBACK_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện cập nhật thông tin phàn hồi đánh ${evaluate._id} giá cho phương tiện ${evaluate.vehicle} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.UPDATE_EVALUATE_FEEDBACK_FAILURE,
      authenticate
    })
  }
}

export const deleteFeedbackController = async (
  req: Request<ParamsDictionary, any, DeleteFeedbackRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const user = req.user as User
  const evaluate = req.evaluate as Evaluate
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  try {
    await EvaluateService.DeleteFeedBack(req.body)

    await writeInfoLog(
      `Thực hiện xóa thông tin phàn hồi đánh ${evaluate._id} giá cho phương tiện ${evaluate.vehicle} thành công (User: ${user._id}) (IP: ${ip}])`
    )

    res.json({
      message: EVALUATE_MESSAGE.DELETE_EVALUATE_FEEDBACK_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện xóa thông tin phàn hồi đánh ${evaluate._id} giá cho phương tiện ${evaluate.vehicle} thất bại (User: ${user._id}) (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.DELETE_EVALUATE_FEEDBACK_FAILURE,
      authenticate
    })
  }
}

export const getEvaluateListController = async (
  req: Request<ParamsDictionary, any, GetEvaluateListRequestBody>,
  res: Response
) => {
  const ip = req.ip
  const vehicle = req.vehicle as Vehicle

  try {
    const result = await EvaluateService.GetEvaluateList(req.body, vehicle)

    await writeInfoLog(`Thực hiện lấy thông tin đánh giá của phương tiện ${vehicle._id} thành công (IP: ${ip}])`)

    res.json({
      result
    })
  } catch (err) {
    await writeErrorLog(
      `Thực hiện lấy thông tin đánh giá của phương tiện ${vehicle._id} thất bại (IP: ${ip}]) | Error: ${err}`
    )

    res.json({
      messgae: EVALUATE_MESSAGE.GET_EVALUATE_FAILURE
    })
  }
}
