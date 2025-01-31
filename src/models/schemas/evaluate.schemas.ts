import { ObjectId } from 'mongodb'

interface EvaluateType {
  _id?: ObjectId
  user: ObjectId
  vehicle: ObjectId
  star: number
  content: string
  feedback?: {
    user: ObjectId
    content: string
  } | null
  created_at?: Date
  updated_at?: Date
}

export default class Evaluate {
  _id: ObjectId
  user: ObjectId
  vehicle: ObjectId
  star: number
  content: string
  feedback: {
    user: ObjectId
    content: string
  } | null
  created_at: Date
  updated_at: Date
  constructor(evaluate: EvaluateType) {
    this._id = evaluate._id || new ObjectId()
    this.user = evaluate.user
    this.vehicle = evaluate.vehicle
    this.star = evaluate.star
    this.content = evaluate.content
    this.feedback = evaluate.feedback || null
    this.created_at = evaluate.created_at || new Date()
    this.updated_at = evaluate.updated_at || new Date()
  }
}
