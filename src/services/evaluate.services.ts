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
import databaseService from './database.services'
import Evaluate from '~/models/schemas/evaluate.schemas'
import Vehicle from '~/models/schemas/vehicle.chemas'
import { ObjectId } from 'mongodb'
import { UserPermission } from '~/constants/enum'
import { EVALUATE_MESSAGE } from '~/constants/message'
import NotificationPrivateService from './notificationPrivate.services'

class EvaluateService {
  async CreateEvaluate(payload: CreateEvaluateRequestBody, user: User, vehicle: Vehicle) {
    const authorVehicle = (await databaseService.users.findOne({ _id: vehicle.user })) as User
    const notificationMessage = `Xin chào ${authorVehicle.display_name}! TANK-Travel xin thông báo rằng bạn đã nhận được một đánh giá mới. Đừng quên xem đánh giá này để hiểu rõ hơn về trải nghiệm của khách hàng.`

    await Promise.all([
      databaseService.evaluate.insertOne(
        new Evaluate({
          ...payload,
          star: payload.rating,
          user: user._id,
          vehicle: vehicle._id
        })
      ),
      NotificationPrivateService.createNotification(vehicle.user, notificationMessage)
    ])
  }

  async UpdateEvaluate(payload: UpdateEvaluateRequestBody, evaluate: Evaluate) {
    await databaseService.evaluate.updateOne(
      {
        _id: evaluate._id
      },
      {
        $set: {
          star: payload.rating,
          content: payload.content
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }

  async DeleteEvaluate(payload: DeleteEvaluateRequestBody) {
    await databaseService.evaluate.deleteOne({ _id: new ObjectId(payload.evaluate_id) })
  }

  async GetEvaluate(payload: GetEvaluateRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const result = await databaseService.evaluate
        .find({
          created_at: { $lt: new Date(payload.session_time) }
        })
        .sort({ created_at: -1 })
        .skip(payload.current)
        .limit(next)
        .toArray()

      const continued = result.length > limit

      const evaluate = result.slice(0, limit)

      const current = payload.current + evaluate.length

      if (evaluate.length === 0) {
        return {
          message: EVALUATE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          evaluate
        }
      }
    } else {
      const result = await databaseService.evaluate
        .aggregate([
          {
            $match: {
              created_at: { $lt: new Date(payload.session_time) }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_VEHICLE_COLLECTION,
              localField: 'vehicle',
              foreignField: '_id',
              as: 'vehicle_info'
            }
          },
          {
            $unwind: '$vehicle_info'
          },
          {
            $match: {
              'vehicle_info.user': user._id
            }
          },
          {
            $project: {
              vehicle_info: 0
            }
          }
        ])
        .toArray()

      const continued = result.length > limit

      const evaluate = result.slice(0, limit)

      const current = payload.current + evaluate.length

      if (evaluate.length === 0) {
        return {
          message: EVALUATE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          evaluate
        }
      }
    }
  }

  async CreateFeedback(payload: CreateFeedbackRequestBody, user: User, evaluate: Evaluate) {
    const customer = (await databaseService.users.findOne({ _id: evaluate.user })) as User
    const notificationMessage = `Chào ${customer?.display_name}! Doanh nghiệp ${user.display_name} đã phản hồi đánh giá của bạn. Hãy xem phản hồi này để biết thêm thông tin chi tiết nhé!`

    await Promise.all([
      databaseService.evaluate.updateOne(
        {
          _id: evaluate._id
        },
        {
          $set: {
            feedback: {
              user: user._id,
              content: payload.content
            }
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      NotificationPrivateService.createNotification(customer._id, notificationMessage)
    ])
  }

  async UpdateFeedback(payload: UpdateFeedbackRequestBody, user: User, evaluate: Evaluate) {
    await databaseService.evaluate.updateOne(
      {
        _id: evaluate._id
      },
      {
        $set: {
          'feedback.user': user._id,
          'feedback.content': payload.content
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }

  async DeleteFeedBack(payload: DeleteFeedbackRequestBody) {
    await databaseService.evaluate.updateOne(
      {
        _id: new ObjectId(payload.evaluate_id)
      },
      {
        $set: {
          feedback: null
        }
      }
    )
  }

  async GetEvaluateList(payload: GetEvaluateListRequestBody, vehicle: Vehicle) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const result = await databaseService.evaluate
      .find({
        vehicle: vehicle._id,
        created_at: { $lt: new Date(payload.session_time) }
      })
      .sort({ created_at: -1 })
      .skip(payload.current)
      .limit(next)
      .toArray()

    const continued = result.length > limit

    const evaluate = result.slice(0, limit)

    const current = payload.current + evaluate.length

    if (evaluate.length === 0) {
      return {
        message: EVALUATE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
        current: payload.current,
        continued: false,
        vehicle: []
      }
    } else {
      return {
        current,
        continued,
        evaluate
      }
    }
  }
}

const evaluateService = new EvaluateService()
export default evaluateService
