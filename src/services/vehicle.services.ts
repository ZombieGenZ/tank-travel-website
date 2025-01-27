import { CreateVehicleReqúetBody, DeleteVehicleReqúetBody } from '~/models/requests/vehicle.requests'
import databaseService from './database.services'
import { Vehicle, VehicleImage } from '~/models/schemas/vehicle.chemas'
import { ObjectId } from 'mongodb'
import fs from 'fs'

class VehicleService {
  async create(payload: CreateVehicleReqúetBody, user_id: ObjectId, preview: VehicleImage[]) {
    await databaseService.vehicles.insertOne(
      new Vehicle({
        ...payload,
        user: user_id,
        preview: preview
      })
    )
  }

  async delete(vehicle: Vehicle) {
    const promises = [] as Promise<void>[]

    vehicle.preview.forEach(async (file) => {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            fs.unlinkSync(file.path)
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    })

    await databaseService.vehicles.deleteOne({ _id: new ObjectId(vehicle._id) })

    await Promise.allSettled(promises)
  }
}
const vehicleService = new VehicleService()
export default vehicleService
