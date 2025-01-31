import { CreateEvaluateRequestBody } from '~/models/requests/evaluate.requests'
import User from '~/models/schemas/users.schemas'
import databaseService from './database.services'
import { Evaluate } from '~/models/schemas/evaluate.schemas'
import { Vehicle } from '~/models/schemas/vehicle.chemas'

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
}

const evaluateService = new EvaluateService()
export default evaluateService
