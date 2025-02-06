import express, { Request, Response } from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

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
import notificationApi from '~/routes/notification.routes'

// import test router
import testApi from '~/routes/test.routes'
import { startBot, stopBot } from './utils/discord'

const app = express()
const server = createServer(app)
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
app.use('/api/notification', notificationApi)

// test router
app.use('/test', testApi)

// default error handler
app.use(defaultErrorHandler)

// realtime logic
io.on('connection', (socket: Socket) => {
  console.log(`\x1b[33mNgười dùng đã kết nối: \x1b[36m${socket.id}\x1b[0m`)

  socket.on('join-room', (room: string) => {
    // các room để nhận phản hồi realtime:
    //
    // room: <user_id>
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
    // room: log
    // sự kiện: new-log
    // mô tả: cập nhật các thông báo về log mới nhất
    // dử liệu: type, value
    // log_type: loại phàn hồi
    // gồm 3 loại:
    // 0: loại thông báo thông tin
    // 1: loại thông báo cảnh báo
    // 2: loại thông báo lỗi
    // content: tin nhắn của hệ thống
    // time: thời gian thông báo được diển ra

    socket.join(room)
    console.log(`\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã tham gia phòng: \x1b[36m${room}\x1b[0m`)
  })

  socket.on('disconnect', () => {
    console.log(`\x1b[33mNgười dùng đã ngắt kết nối: \x1b[36m${socket.id}\x1b[0m`)
  })
})

server.listen(port, async () => {
  console.log()
  console.log(`\x1b[33mMáy chủ đang chạy trên port \x1b[36m${port}\x1b[0m`)
  console.log(`\x1b[33mTruy cập tại: \x1b[36m${process.env.APP_URL}/\x1b[0m`)
  console.log()
  await startBot()
})

process.on('SIGINT', async () => {
  console.log()
  console.log(`\x1b[33mMáy chủ đã ngừng hoạt động\x1b[0m`)
  console.log()
  await stopBot()
})

export { io }
