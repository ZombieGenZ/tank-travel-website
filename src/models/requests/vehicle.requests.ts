import { VehicleTypeEnum, SeatType } from '~/constants/enum'

export interface GetVehicleInfoRequestBody {
  refresh_token: string
}

export interface CreateVehicleRequestBody {
  refresh_token: string
  vehicle_type: VehicleTypeEnum
  seat_type: SeatType
  seats: number
  rules: string
  amenities: string
  license_plate: string
}

export interface UpdateVehicleRequestBody {
  refresh_token: string
  vehicle_id: string
  vehicle_type: VehicleTypeEnum
  seat_type: SeatType
  seats: number
  rules: string
  amenities: string
  preview: [string]
  license_plate: string
}

export interface VehicleIdRequestBody {
  refresh_token: string
  vehicle_id: string
}

export interface GetVehicleRequestBody {
  refresh_token: string
  current: number
}

export interface FindVehicleRequestBody {
  refresh_token: string
  current: number
  keywords: string
}

export interface CensorVehicleRequestBody {
  refresh_token: string
  vehicle_id: string
  decision: boolean
}

export interface GetVehicleListRequestBody {
  refresh_token: string
}
