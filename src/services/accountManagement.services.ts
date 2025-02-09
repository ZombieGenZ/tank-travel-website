import {
  GetAccountRequestBody,
  FindAccountRequestBody,
  BanAccountRequestBody
} from '~/models/requests/accountManagement.requests'
import databaseService from './database.services'
import { ACCOUNT_MANAGEMENT_MESSAGE } from '~/constants/message'
import { ObjectId } from 'mongodb'
import { createRegexPattern } from '~/utils/regex'
import User from '~/models/schemas/users.schemas'

class AccountmManagementService {
  async getAccount(payload: GetAccountRequestBody) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const result = await databaseService.users
      .find({})
      .project({
        password: 0,
        forgot_password_token: 0
      })
      .sort({ created_at: -1 })
      .skip(payload.current)
      .limit(next)
      .toArray()

    const continued = result.length > limit

    const account = result.slice(0, limit)

    const current = payload.current + account.length

    if (account.length === 0) {
      return {
        message: ACCOUNT_MANAGEMENT_MESSAGE.NO_MATCHING_RESULTS_FOUND,
        current: payload.current,
        continued: false,
        vehicle: []
      }
    } else {
      return {
        current,
        continued,
        account
      }
    }
  }

  async findAccount(payload: FindAccountRequestBody) {
    const limit = Number(process.env.LOAD_QUANTITY_LIMIT as string)
    const next = limit + 1

    const searchQuery: any = {}
    if (payload.keywords) {
      searchQuery.$or = [
        {
          display_name: {
            $regex: createRegexPattern(payload.keywords),
            $options: 'i'
          }
        },
        {
          email: {
            $regex: payload.keywords,
            $options: 'i'
          }
        },
        {
          phone: {
            $regex: payload.keywords,
            $options: 'i'
          }
        }
      ]

      if (payload.keywords.match(/^[0-9a-fA-F]{24}$/)) {
        searchQuery.$or.push({
          _id: new ObjectId(payload.keywords)
        })
      }
    }

    const result = await databaseService.users
      .find(searchQuery)
      .project({
        password: 0,
        forgot_password_token: 0
      })
      .sort({ created_at: -1 })
      .skip(payload.current)
      .limit(next)
      .toArray()

    const continued = result.length > limit

    const account = result.slice(0, limit)

    const current = payload.current + account.length

    if (account.length === 0) {
      return {
        message: ACCOUNT_MANAGEMENT_MESSAGE.NO_MATCHING_RESULTS_FOUND,
        current: payload.current,
        continued: false,
        vehicle: []
      }
    } else {
      return {
        current,
        continued,
        account
      }
    }
  }

  async banAccount(payload: BanAccountRequestBody, user: User) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(payload.user_id)
      },
      {
        $set: {
          penalty: {
            created_by: user._id,
            reason: payload.reason,
            expired_at: payload.expired_at
          }
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }

  async unBanAccount(user_id: string) {
    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            penalty: null
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      databaseService.refreshToken.deleteMany({ user_id: new ObjectId(user_id) })
    ])
  }
}

const accountManagementService = new AccountmManagementService()
export default accountManagementService
