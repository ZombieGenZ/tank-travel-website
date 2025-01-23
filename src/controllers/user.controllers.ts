import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USER_MESSAGE } from '~/constants/message'
import { RegisterRequestBody } from '~/models/requests/user.requests'
import UserServices from '~/services/user.services'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await UserServices.register(req.body)

  res.json({
    message: USER_MESSAGE.REGISTER_SUCCESS,
    result
  })
}
