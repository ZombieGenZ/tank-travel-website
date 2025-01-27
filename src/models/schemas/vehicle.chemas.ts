import { ObjectId } from 'mongodb'
import { VehicleTypeEnum, VehicleStatus, SeatType } from '~/constants/enum'

interface VehicleType {
  _id?: ObjectId
  vehicle_type: VehicleTypeEnum
  seat_type: SeatType
  seats: number
  rules: string
  amenities: string // tiện nghi
  preview: VehicleImage[]
  license_plate: string // Biển số xe
  user: ObjectId
  status?: VehicleStatus
}

export interface VehicleImage {
  type: string
  path: string
  url: string
  size: number // Kích thước của ảnh (byte)
}

export class Vehicle {
  _id: ObjectId
  vehicle_type: VehicleTypeEnum
  seat_type: SeatType
  seats: number
  rules: string
  amenities: string
  preview: VehicleImage[]
  license_plate: string
  user: ObjectId
  status: VehicleStatus
  constructor(vehicle: VehicleType) {
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
  }
}
