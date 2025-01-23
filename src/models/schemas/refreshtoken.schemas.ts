import { ObjectId } from "mongodb"

interface RefreshTokenType {
  _id?: ObjectId
  token: string
  createdAt?: Date
  userid: ObjectId
}

export default class RefreshToken {
  _id: ObjectId
  token: string
  createdAt: Date
  userid: ObjectId
  constructor(token: RefreshTokenType) {
    this._id = token._id || new ObjectId()
    this.token = token.token
    this.createdAt = token.createdAt || new Date()
    this.userid = token.userid
  }
}
