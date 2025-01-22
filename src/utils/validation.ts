import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTPSTATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/errors'

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validations.run(req)

    const errors = validationResult(req)

    if (errors.isEmpty()) {
      next()
      return
    }

    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })

    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== HTTPSTATUS.UNPROCESSABLE_ENTITY) {
        next(msg)
        return
      }

      entityError.errors[key] = errorsObject[key]
    }

    next(entityError)
  }
}
