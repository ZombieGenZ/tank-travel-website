import { Request } from 'express'
import User from './models/schemas/users.schemas'
import { TokenPayload } from '~/models/requests/user.requests'
import Vehicle from '~/models/schemas/vehicle.chemas'
import { ImageType } from '~/constants/image'
import { BusRoute } from './models/schemas/busRoute.schemas'
import { BillDetail } from '~/models/schemas/billDetail.schemas'
import { Evaluate } from '~/models/schemas/evaluate.schemas'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    access_token?: string
    refresh_token?: string
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    preview?: ImageType[]
    vehicle?: Vehicle
    bus_route?: BusRoute
    billDetail?: BillDetail
    evaluate?: Evaluate
  }
}
