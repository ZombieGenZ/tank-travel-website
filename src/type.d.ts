import { Request } from 'express'
import User from './models/schemas/Users.schema'
import { TokenPayload } from '~/models/requests/user.requests'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    access_token?: string
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
