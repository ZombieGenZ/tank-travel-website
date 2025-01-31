import { Db, MongoClient, Collection } from 'mongodb'
import User from '~/models/schemas/users.schemas'
import RefreshToken from '~/models/schemas/refreshtoken.schemas'
import dotenv from 'dotenv'
import EmailVerifyCode from '~/models/schemas/emailverifycode.schemas'
import { Vehicle } from '~/models/schemas/vehicle.chemas'
import { BusRoute } from '~/models/schemas/busRoute.schemas'
import { BillDetail } from '~/models/schemas/billDetail.schemas'
import { Bill } from '~/models/schemas/bill.schemas'
import { Profit } from '~/models/schemas/profit.schemas'
import { Evaluate } from '~/models/schemas/evaluate.schemas'
dotenv.config()

const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@datvexe.bxmnu.mongodb.net/?retryWrites=true&w=majority&appName=DatVeXe`

export class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DATABASE_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log(`\x1b[33mĐã kết nối thành công đến cơ sở dử liệu \x1b[36m${process.env.DATABASE_NAME}\x1b[0m`)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DATABASE_USER_COLLECTION as string)
  }
  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DATABASE_REFRESH_TOKEN_COLLECTION as string)
  }
  get emailVerifyCodes(): Collection<EmailVerifyCode> {
    return this.db.collection(process.env.DATABASE_EMAIL_VERIFY_CODE_COLLECTION as string)
  }
  get vehicles(): Collection<Vehicle> {
    return this.db.collection(process.env.DATABASE_VEHICLE_COLLECTION as string)
  }
  get busRoute(): Collection<BusRoute> {
    return this.db.collection(process.env.DATABASE_BUS_ROUTE_COLLECTION as string)
  }
  get profit(): Collection<Profit> {
    return this.db.collection(process.env.DATABASE_PROFIT_COLLECTION as string)
  }
  get bill(): Collection<Bill> {
    return this.db.collection(process.env.DATABASE_BILL_COLLECTION as string)
  }
  get billDetail(): Collection<BillDetail> {
    return this.db.collection(process.env.DATABASE_BILL_DETAIL_COLLECTION as string)
  }
  get evaluate(): Collection<Evaluate> {
    return this.db.collection(process.env.DATABASE_EVALUATE_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
