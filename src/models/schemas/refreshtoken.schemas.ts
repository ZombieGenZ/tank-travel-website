import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: ObjectId
}

export default class RefreshToken {
  _id: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
  constructor(token: RefreshTokenType) {
    this._id = token._id || new ObjectId()
    this.token = token.token
    this.created_at = token.created_at || new Date()
    this.user_id = token.user_id
  }
}
