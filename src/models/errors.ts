import HTTPSTATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'

type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class ErrorWithStatus {
  messgae: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.messgae = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorType
  constructor({ message = USER_MESSAGE.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HTTPSTATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
