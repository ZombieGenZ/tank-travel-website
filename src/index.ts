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
