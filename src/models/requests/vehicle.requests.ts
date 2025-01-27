import { VehicleTypeEnum, SeatType, VehicleStatus } from '~/constants/enum'

export interface CreateVehicleReqúetBody {
  refresh_token: string
  vehicle_type: VehicleTypeEnum
  seat_type: SeatType
  seats: number
  rules: string
  amenities: string
  preview: [string]
  license_plate: string
  status?: VehicleStatus
}

export interface DeleteVehicleReqúetBody {
  refresh_token: string
  vehicle_id: string
}
