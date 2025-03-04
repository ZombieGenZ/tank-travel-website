import { ObjectId } from 'mongodb'
import { VehicleTypeEnum, VehicleStatus, SeatType } from '~/constants/enum'
import { ImageType } from '~/constants/image'

interface VehicleType {
  _id?: ObjectId
  vehicle_type: VehicleTypeEnum
  seat_type: SeatType
  seats: number
  rules: string
  amenities: string // tiện nghi
  preview: ImageType[]
  license_plate: string // Biển số xe
  user: ObjectId
  average_rating?: number
  created_at?: Date
  updated_at?: Date
  status?: VehicleStatus
}

export default class Vehicle {
  _id: ObjectId
  vehicle_type: VehicleTypeEnum
  seat_type: SeatType
  seats: number
  rules: string
  amenities: string
  preview: ImageType[]
  license_plate: string
  user: ObjectId
  average_rating: number
  created_at: Date
  updated_at: Date
  status: VehicleStatus
  constructor(vehicle: VehicleType) {
    const date = new Date()

    this._id = vehicle._id || new ObjectId()
    this.vehicle_type = vehicle.vehicle_type
    this.seat_type = vehicle.seat_type
    this.seats = vehicle.seats
    this.rules = vehicle.rules
    this.amenities = vehicle.amenities
    this.preview = vehicle.preview
    this.license_plate = vehicle.license_plate
    this.user = vehicle.user
    this.status = vehicle.status || VehicleStatus.PENDING_APPROVAL
    this.average_rating = vehicle.average_rating || 0
    this.created_at = vehicle.created_at || date
    this.updated_at = vehicle.created_at || date
  }
}
