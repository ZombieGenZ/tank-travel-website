import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { UserPermission } from '~/constants/enum'
import HTTPSTATUS from '~/constants/httpStatus'
import { AUTHENTICATION_MESSAGE } from '~/constants/message'
import { TokenPayload } from '~/models/requests/user.requests'
import User from '~/models/schemas/users.schemas'
import databaseService from '~/services/database.services'
import UsersServices from '~/services/user.services'
import { verifyToken } from '~/utils/jwt'

export const authenticationValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  const { refresh_token } = req.body

  if (!authorization || typeof authorization !== 'string' || authorization === '' || !authorization.split(' '[1])) {
    if (!refresh_token || typeof refresh_token !== 'string' || refresh_token === '') {
      res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
      return
    }

    try {
      const decoded_refresh_token = (await verifyToken({
        token: refresh_token,
        publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
      })) as TokenPayload

      const { user_id } = decoded_refresh_token
      const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

      if (!user) {
        res
          .status(HTTPSTATUS.UNAUTHORIZED)
          .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
        return
      }

      const new_access_token = await UsersServices.signAccessToken(user_id)
      const new_refresh_token = await UsersServices.signRefreshToken(user_id)
      await UsersServices.changeRefreshToken(user_id, new_access_token)

      req.user = user
      req.access_token = new_access_token
      req.refresh_token = new_refresh_token

      next()
      return
    } catch (err) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: AUTHENTICATION_MESSAGE.REFRESH_TOKEN_INVALID })
    }
  }

  try {
    const token = authorization?.split(' ')[1]

    const decoded_access_token = (await verifyToken({
      token: token as string,
      publicKey: process.env.SECURITY_JWT_SECRET_ACCESS_TOKEN as string
    })) as TokenPayload

    await verifyToken({
      token: token as string,
      publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
    })

    const { user_id } = decoded_access_token
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
      res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
      return
    }

    req.user = user
    req.access_token = token
    req.refresh_token = refresh_token

    next()
    return
  } catch {
    try {
      const decoded_refresh_token = (await verifyToken({
        token: refresh_token,
        publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
      })) as TokenPayload

      const { user_id } = decoded_refresh_token
      const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

      if (!user) {
        res
          .status(HTTPSTATUS.UNAUTHORIZED)
          .json({ message: AUTHENTICATION_MESSAGE.ACCESS_TOKEN_AND_REFRESH_TOKEN_IS_MISSING })
        return
      }

      const new_access_token = await UsersServices.signAccessToken(user_id)
      const new_refresh_token = await UsersServices.signRefreshToken(user_id)
      await UsersServices.changeRefreshToken(user_id, new_access_token)

      req.user = user
      req.access_token = new_access_token
      req.refresh_token = new_refresh_token

      next()
      return
    } catch (err) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: AUTHENTICATION_MESSAGE.REFRESH_TOKEN_INVALID })
    }
  }
}

export const customerAuthenticationValidator = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  if (
    user &&
    (user.permission == UserPermission.CUSTOMER ||
      user.permission == UserPermission.BUSINESS ||
      user.permission == UserPermission.ADMINISTRATOR)
  ) {
    next()
    return
  }

  res.status(HTTPSTATUS.UNAUTHORIZED).json({
    message: AUTHENTICATION_MESSAGE.NOT_PERMISSION_TODO_THIS,
    authenticate
  })
}

export const businessAuthenticationValidator = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  if (user && (user.permission == UserPermission.BUSINESS || user.permission == UserPermission.ADMINISTRATOR)) {
    next()
    return
  }

  res.status(HTTPSTATUS.UNAUTHORIZED).json({
    message: AUTHENTICATION_MESSAGE.NOT_PERMISSION_TODO_THIS,
    authenticate
  })
}

export const administratorAuthenticationValidator = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const { access_token, refresh_token } = req
  const authenticate = {
    access_token,
    refresh_token
  }

  if (user && user.permission == UserPermission.ADMINISTRATOR) {
    next()
    return
  }

  res.status(HTTPSTATUS.UNAUTHORIZED).json({
    message: AUTHENTICATION_MESSAGE.NOT_PERMISSION_TODO_THIS,
    authenticate
  })
}
