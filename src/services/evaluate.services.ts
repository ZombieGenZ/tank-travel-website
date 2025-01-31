import {
  CreateEvaluateRequestBody,
  UpdateEvaluateRequestBody,
  DeleteEvaluateRequestBody
} from '~/models/requests/evaluate.requests'
import User from '~/models/schemas/users.schemas'
import databaseService from './database.services'
import Evaluate from '~/models/schemas/evaluate.schemas'
import Vehicle from '~/models/schemas/vehicle.chemas'
import { ObjectId } from 'mongodb'

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
}

const evaluateService = new EvaluateService()
export default evaluateService
