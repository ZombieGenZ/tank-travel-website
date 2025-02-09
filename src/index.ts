import express, { Request, Response } from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { formatDateFull } from '~/utils/date'
import { startBot, stopBot } from './utils/discord'
import { TokenPayload } from './models/requests/user.requests'
import { verifyToken } from './utils/jwt'
import { ObjectId } from 'mongodb'
import { writeInfoLog } from './utils/log'
import { UserPermission } from './constants/enum'

dotenv.config()
const port = process.env.APP_PORT || 3000

// import download router
import downloadApi from '~/routes/download.routes'

// import api router
import userApi from '~/routes/user.routes'
import vehicleApi from '~/routes/vehicle.routes'
import busRouteApi from '~/routes/busRoute.routes'
import orderApi from '~/routes/order.routes'
import evaluateApi from '~/routes/evaluate.routes'
import businessRegistrationApi from '~/routes/businessRegistration.routes'
import notificationGlobalApi from '~/routes/notification-global.routes'
import accountManagementApi from '~/routes/accountManagement.routes'
import statisticalApi from '~/routes/statistical.routes'

// import test router
import testApi from '~/routes/test.routes'

const app = express()
const server = createServer(app)
const runningTime = formatDateFull(new Date())
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
})

// realtime middleware
app.use((req, res, next) => {
  ;(req as any).io = io
  next()
})

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('trust proxy', true)

databaseService.connect()

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' })
})

// download router
app.use('/download', downloadApi)

// api router
app.use('/api/users', userApi)
app.use('/api/vehicle', vehicleApi)
app.use('/api/bus-route', busRouteApi)
app.use('/api/order', orderApi)
app.use('/api/evaluate', evaluateApi)
app.use('/api/business-registration', businessRegistrationApi)
app.use('/api/notification-global', notificationGlobalApi)
app.use('/api/account-management', accountManagementApi)
app.use('/api/statistical', statisticalApi)

// test router
app.use('/test', testApi)

// default error handler
app.use(defaultErrorHandler)

// realtime logic
io.on('connection', (socket: Socket) => {
  console.log(`\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến máy chủ \x1b[36m${port}\x1b[0m`)

  socket.on('connect-user-realtime', async (refresh_token: string) => {
    if (refresh_token !== null && refresh_token !== undefined && refresh_token.trim() !== '') {
      try {
        const decoded_refresh_token = (await verifyToken({
          token: refresh_token,
          publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
        })) as TokenPayload

        const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

        if (user !== null && user !== undefined) {
          // Phòng: user-<user_id>
          // sự kiện:
          // update-balance: cập nhật số dư của người dùng
          // update-revenue: cập nhật doanh thu của doanh nghiệp/quản trị viên
          // new-private-notificaton: cập nhật thông báo mới cho người dùng
          //
          // mô tả chi tiết sự kiện:
          // sự kiện: update-balance
          // mô tả: cập nhật thông tin số dư của người dùng
          // dử liệu: type, value
          // type: loại phàn hồi (gồm 2 loại '+' và '-')
          // value: giá trị của phản hồi
          //
          // sự kiện: update-revenue
          // mô tả: cập nhật thông tin doanh thu của doanh nghiệp/quản trị viên
          // dử liệu: type, value
          // type: loại phàn hồi (gồm 2 loại '+' và '-')
          // value: giá trị của phản hồi
          //
          // sự kiện: new-private-notificaton
          // mô tả: cập nhật thông báo mới cho người dùng
          // dử liệu: sender, message
          // sender: là người gửi thông báo
          // message: tin nhắn được gửi tới

          socket.join(`user-${user._id}`)
          await writeInfoLog(`Người dùng ${user._id} (SocketID: ${socket.id}) đã kết nối đến phòng user-${user._id}`)
          console.log(
            `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36muser-${user._id}\x1b[0m`
          )
        }
      } catch {
        console.log()
      }
    }
  })

  socket.on('connect-admin-realtime', async (refresh_token: string) => {
    if (refresh_token !== null && refresh_token !== undefined && refresh_token.trim() !== '') {
      try {
        const decoded_refresh_token = (await verifyToken({
          token: refresh_token,
          publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
        })) as TokenPayload

        const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

        if (user !== null && user !== undefined && user.permission === UserPermission.ADMINISTRATOR) {
          // Phòng: system-log
          // sự kiện:
          // new-system-log: cập nhật thông báo về hệ thống cho quản trị viên
          //
          // mô tả chi tiết sự kiện:
          // sự kiện: new-system-log
          // mô tả: cập nhật thông báo về hệ thống cho quản trị viên
          // dử liệu: log_type, content, time
          // log_type: loại log (gồm 1 loại 'info', 2 loại 'warning', 3 loại 'error')
          // content: tin nhắn của log
          // time: thời gian của log

          socket.join(`system-log`)
          await writeInfoLog(`Quản trị viên ${user._id} (SocketID: ${socket.id}) đã kết nối đến phòng system-log`)
          console.log(`\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36msystem-log\x1b[0m`)
        }
      } catch {
        console.log()
      }
    }
  })

  socket.on('disconnect', () => {
    console.log(`\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã ngắt kết nối đến máy chủ \x1b[36m${port}\x1b[0m`)
  })
})

server.listen(port, async () => {
  await startBot()
  console.log()
  console.log(`\x1b[33mMáy chủ đang chạy trên port \x1b[36m${port}\x1b[0m`)
  console.log(`\x1b[33mTruy cập tại: \x1b[36m${process.env.APP_URL}/\x1b[0m`)
  console.log()
})

process.on('SIGINT', async () => {
  console.log()
  console.log(`\x1b[33mMáy chủ đã ngừng hoạt động\x1b[0m`)
  console.log()
  await stopBot()
  console.log()
  process.exit(0)
})

export { io, runningTime }
