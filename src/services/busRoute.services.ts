import {
  CreateBusRouteRequestBody,
  UpdateBusRouteRequestBody,
  DeleteBusRouteRequestBody,
  GetBusRouteRequestBody,
  FindBusRouteRequestBody
} from '~/models/requests/busRoute.requests'
import databaseService from './database.services'
import BusRoute from '~/models/schemas/busRoute.schemas'
import { ObjectId } from 'mongodb'
import { UserPermission } from '~/constants/enum'
import User from '~/models/schemas/users.schemas'
import { BUSROUTE_MESSAGE } from '~/constants/message'

class BusRouteService {
  async createBusRoute(payload: CreateBusRouteRequestBody) {
    await databaseService.busRoute.insertOne(
      new BusRoute({
        ...payload,
        vehicle: new ObjectId(payload.vehicle_id)
      })
    )
  }

  async updateBusRoute(payload: UpdateBusRouteRequestBody) {
    databaseService.busRoute.updateOne(
      {
        _id: new ObjectId(payload.bus_route_id)
      },
      {
        $set: {
          vehicle: new ObjectId(payload.vehicle_id),
          start_point: payload.start_point,
          end_point: payload.end_point,
          departure_time: payload.departure_time,
          arrival_time: payload.arrival_time,
          price: payload.price,
          quantity: payload.quantity
        },
        $currentDate: { updated_at: true }
      }
    )
  }

  async deleteBusRoute(payload: DeleteBusRouteRequestBody) {
    await databaseService.busRoute.deleteOne({
      _id: new ObjectId(payload.bus_route_id)
    })
  }

  async getBusRoute(payload: GetBusRouteRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const result = await databaseService.busRoute
        .find({})
        .sort({ created_at: -1 })
        .skip(payload.current)
        .limit(next)
        .toArray()

      const continued = result.length > limit

      const busRoute = result.slice(0, limit)

      const current = payload.current + busRoute.length

      if (busRoute.length === 0) {
        return {
          message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          busRoute
        }
      }
    } else {
      const result = await databaseService.busRoute
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
            $unwind: {
              path: '$vehicle_info',
              preserveNullAndEmptyArrays: false
            }
          },
          {
            $match: { 'vehicle_info.user': user._id }
          },
          {
            $project: {
              vehicle_info: 0
            }
          },
          {
            $sort: { created_at: -1 }
          },
          {
            $skip: payload.current
          },
          {
            $limit: next
          }
        ])
        .toArray()

      const continued = result.length > limit

      const busRoute = result.slice(0, limit)

      const current = payload.current + busRoute.length

      if (busRoute.length === 0) {
        return {
          message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          busRoute
        }
      }
    }
  }

  async findBusRoute(payload: FindBusRouteRequestBody, user: User) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    if (user.permission == UserPermission.ADMINISTRATOR) {
      const keywords = payload.keywords.split(' ')

      const searchQuery = {
        $or: keywords.map((key) => ({
          $or: [
            { start_point: { $regex: key, $options: 'i' } },
            { end_point: { $regex: key, $options: 'i' } },

            ...(isNaN(Number(key)) ? [] : [{ price: Number(key) }, { quantity: Number(key) }])
          ]
        }))
      }

      const result = await databaseService.busRoute
        .find(searchQuery)
        .sort({ created_at: -1 })
        .skip(payload.current)
        .limit(next)
        .toArray()

      const continued = result.length > limit

      const busRoute = result.slice(0, limit)

      const current = payload.current + busRoute.length

      if (busRoute.length === 0) {
        return {
          message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          busRoute
        }
      }
    } else {
      const keywords = payload.keywords.split(' ')

      const pipeline = [
        {
          $lookup: {
            from: process.env.DATABASE_VEHICLE_COLLECTION,
            localField: 'vehicle',
            foreignField: '_id',
            as: 'vehicle_info'
          }
        },
        {
          $unwind: {
            path: '$vehicle_info',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $match: {
            'vehicle_info.user': user._id,
            $or: keywords.map((key) => ({
              $or: [
                { start_point: { $regex: key, $options: 'i' } },
                { end_point: { $regex: key, $options: 'i' } },
                ...(isNaN(Number(key)) ? [] : [{ price: Number(key) }, { quantity: Number(key) }])
              ]
            }))
          }
        },
        {
          $project: {
            vehicle_info: 0
          }
        },
        {
          $sort: { created_at: -1 }
        },
        {
          $skip: payload.current
        },
        {
          $limit: next
        }
      ]

      const result = await databaseService.busRoute.aggregate(pipeline).toArray()

      const continued = result.length > limit

      const busRoute = result.slice(0, limit)

      const current = payload.current + busRoute.length

      if (busRoute.length === 0) {
        return {
          message: BUSROUTE_MESSAGE.NO_MATCHING_RESULTS_FOUND,
          current: payload.current,
          continued: false,
          vehicle: []
        }
      } else {
        return {
          current,
          continued,
          busRoute
        }
      }
    }
  }
}

const busRouteService = new BusRouteService()
export default busRouteService
