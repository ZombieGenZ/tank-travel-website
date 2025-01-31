import {
  CreateEvaluateRequestBody,
  UpdateEvaluateRequestBody,
  DeleteEvaluateRequestBody,
  GetEvaluateRequestBody
} from '~/models/requests/evaluate.requests'
import User from '~/models/schemas/users.schemas'
import databaseService from './database.services'
import Evaluate from '~/models/schemas/evaluate.schemas'
import Vehicle from '~/models/schemas/vehicle.chemas'
import { ObjectId } from 'mongodb'
import { UserPermission } from '~/constants/enum'
import { EVALUATE_MESSAGE } from '~/constants/message'

class EvaluateService {
  async CreateEvaluate(payload: CreateEvaluateRequestBody, user: User, vehicle: Vehicle) {
    await databaseService.evaluate.insertOne(
      new Evaluate({
        ...payload,
        star: payload.rating,
        user: user._id,
        vehicle: vehicle._id
      })
    )
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
        .find({})
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
}

const evaluateService = new EvaluateService()
export default evaluateService
