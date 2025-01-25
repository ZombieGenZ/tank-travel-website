import { ObjectId } from 'mongodb'

interface EmailVerifyCodeType {
  _id?: ObjectId
  email: string
  code: string
}

export default class EmailVerifyCode {
  _id: ObjectId
  email: string
  code: string
  constructor(email_verify_code: EmailVerifyCodeType) {
    this._id = email_verify_code._id || new ObjectId()
    this.email = email_verify_code.email
    this.code = email_verify_code.code
  }
}
