import express, { Request, Response } from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { formatDateFull, formatDateFull2 } from '~/utils/date'
import { startBot, stopBot } from './utils/discord'
import { TokenPayload } from './models/requests/user.requests'
import { verifyToken } from './utils/jwt'
import { ObjectId } from 'mongodb'
import { writeInfoLog } from './utils/log'
import { SeatType, UserPermission, VehicleTypeEnum } from './constants/enum'

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
import revenueApi from '~/routes/revenue.routes'
import notificationPrivateApi from '~/routes/notification-priate.routes'

// import test router
import testApi from '~/routes/test.routes'
import runAllCrons from './jobs/global.jobs'

const app = express()
const server = createServer(app)
const serverRunningTime = new Date()
const runningTime = formatDateFull(serverRunningTime)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 10e7,
  allowEIO3: true
})
app.set('trust proxy', true)

databaseService.connect()

// realtime middleware
app.use((req, res, next) => {
  ;(req as any).io = io
  next()
})

runAllCrons()

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('trust proxy', true)

app.get('/', (req: Request, res: Response) => {
  res.render('trang-chu')
})

app.get('/login', (req: Request, res: Response) => {
  res.render('dang-nhap')
})

app.get('/ticket-info', (req: Request, res: Response) => {
  res.render('ticket-infomation')
})

app.get('/forgot_pass', (req: Request, res: Response) => {
  res.render('forgot_password')
})

app.get('/business_signup', (req: Request, res: Response) => {
  res.render('business_registration')
})

app.get('/forgot-password', async (req: Request, res: Response) => {
  if (!req.query.token) {
    // DOITAFTER: màn hình 404
    res.json({
      message: 'You do not permission to access this page'
    })
  } else {
    const result = await databaseService.users.findOne({
      forgot_password_token: req.query.token as string
    })

    if (!result) {
      res.json({
        message: 'Token is invalid'
      })
      return
    }

    res.render('change_password')
  }
})

app.get('/recharge', (req: Request, res: Response) => {
  res.render('recharge')
})

app.get('/booking_history', (req: Request, res: Response) => {
  res.render('booking_history')
})

app.get('/profile', (req: Request, res: Response) => {
  res.render('profile')
})

app.get('/order/bill', async (req: Request, res: Response) => {
  if (!req.query.id) {
    // DOITAFTER: màn hình 404
    res.json({
      message: 'You do not permission to access this page'
    })
    return
  }

  const bill = await databaseService.bill.findOne({ _id: new ObjectId(req.query.id.toString()) })

  if (!bill) {
    // DOITAFTER: màn hình 404
    res.json({
      message: 'You do not permission to access this page'
    })
    return
  }

  const busRoute = await databaseService.busRoute.findOne({ _id: bill.bus_route })

  if (!busRoute) {
    // DOITAFTER: màn hình 404
    res.json({
      message: 'You do not permission to access this page'
    })
    return
  }

  const vehicle = await databaseService.vehicles.findOne({ _id: busRoute.vehicle })

  if (!vehicle) {
    // DOITAFTER: màn hình 404
    res.json({
      message: 'You do not permission to access this page'
    })
    return
  }

  res.render('bill_information', {
    start_point: busRoute.start_point,
    end_point: busRoute.end_point,
    vehicle_type:
      vehicle.vehicle_type == VehicleTypeEnum.BUS
        ? 'xe khách'
        : vehicle.vehicle_type == VehicleTypeEnum.TRAIN
          ? 'tàu hỏa'
          : vehicle.vehicle_type == VehicleTypeEnum.PLANE
            ? 'máy bay'
            : 'Không xác định',
    seats_type:
      vehicle.seat_type == SeatType.SEATING_SEAT
        ? 'Ghế ngồi'
        : vehicle.seat_type == SeatType.SLEEPER_SEAT
          ? 'Giường nằm'
          : vehicle.seat_type == SeatType.HYBRID_SEAT
            ? 'Ghế vừa nằm vừa ngồi'
            : 'Không xác định',
    departure_time: formatDateFull2(busRoute.departure_time),
    arrival_time: formatDateFull2(busRoute.arrival_time),
    booking_time: bill.booking_time,
    seats: bill.quantity
  })
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
app.use('/api/revenue', revenueApi)
app.use('/api/notification-private', notificationPrivateApi)

// test router
app.use('/test', testApi)

// default error handler
app.use(defaultErrorHandler)

// realtime logic
io.on('connection', (socket: Socket) => {
  console.log(
    `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến máy chủ \x1b[36m${process.env.TRADEMARK_NAME} ${port}\x1b[0m`
  )

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

  socket.on('connect-statistics-realtime', async (refresh_token: string) => {
    if (refresh_token !== null && refresh_token !== undefined && refresh_token.trim() !== '') {
      try {
        const decoded_refresh_token = (await verifyToken({
          token: refresh_token,
          publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
        })) as TokenPayload

        const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

        if (
          user !== null &&
          user !== undefined &&
          (user.permission === UserPermission.BUSINESS || user.permission === UserPermission.ADMINISTRATOR)
        ) {
          // Phòng: statistics-<user_id>
          // sự kiện:
          // update-statistics-revenue: cập nhật thống kê doanh thu cho doanh nghiệp
          // update-statistics-order: cập nhật thống kê số lượng bán ra cho doanh nghiệp
          //
          // mô tả chi tiết sự kiện:
          // sự kiện: update-statistics-revenue
          // mô tả: cập nhật thống kê doanh thu cho doanh nghiệp
          // dử liệu: type, value
          // type: loại phàn hồi (gồm 2 loại '+' và '-')
          // value: giá trị của phản hồi
          //
          // sự kiện: update-statistics-order
          // mô tả: cập nhật thống kê số lượng vé bán ra cho doanh nghiệp
          // dử liệu: type, value
          // type: loại phàn hồi (gồm 2 loại '+' và '-')
          // value: giá trị của phản hồi
          //
          // sự kiện: update-statistics-deal
          // mô tả: cập nhật thống kê số lượng đơn bán ra cho doanh nghiệp
          // dử liệu: type, value
          // type: loại phàn hồi (gồm 2 loại '+' và '-')
          // value: giá trị của phản hồi
          //
          // Phòng: statistics-global
          // sự kiện:
          // update-statistics-revenue-global: cập nhật thống kê doanh thu của toàn hệ thống
          // update-statistics-order-globa;: cập nhật thống kê số lượng bán ra của toàn hệ thống
          //
          // mô tả chi tiết sự kiện:
          // sự kiện: update-statistics-revenue-global
          // mô tả: cập nhật thống kê doanh thu của toàn hệ thống
          // dử liệu: type, value
          // type: loại phàn hồi (gồm 2 loại '+' và '-')
          // value: giá trị của phản hồi
          //
          // sự kiện: update-statistics-order-global
          // mô tả: cập nhật thống kê số lượng vé bán ra của toàn hệ thống
          // dử liệu: type, value
          // type: loại phàn hồi (gồm 2 loại '+' và '-')
          // value: giá trị của phản hồi
          //
          // sự kiện: update-statistics-deal-global
          // mô tả: cập nhật thống kê số lượng đơn bán ra của toàn hệ thống
          // dử liệu: type, value
          // type: loại phàn hồi (gồm 2 loại '+' và '-')
          // value: giá trị của phản hồi

          if (user.permission === UserPermission.ADMINISTRATOR) {
            socket.join(`statistics-global`)
            await writeInfoLog(
              `Quản trị viên ${user._id} (SocketID: ${socket.id}) đã kết nối đến phòng statistics-global`
            )
            console.log(
              `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mstatistics-global\x1b[0m`
            )
          } else {
            socket.join(`statistics-${user._id}`)
            await writeInfoLog(
              `Doanh nghiệp ${user._id} (SocketID: ${socket.id}) đã kết nối đến phòng statistics-${user._id}`
            )
            console.log(
              `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mstatistics-${user._id}\x1b[0m`
            )
          }
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

  socket.on('connect-payment-realtime', async (refresh_token: string, order_id: string) => {
    if (refresh_token !== null && refresh_token !== undefined && refresh_token.trim() !== '') {
      try {
        const decoded_refresh_token = (await verifyToken({
          token: refresh_token,
          publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
        })) as TokenPayload

        const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

        if (user !== null && user !== undefined) {
          // Phòng: BANK_<order_id>
          // sự kiện:
          // update-order-status: cập nhật trạng thái đơn hàng cho người dùng
          //
          // mô tả chi tiết sự kiện:
          // sự kiện: update-order-status
          // mô tả: cập nhật trạng thái đơn hàng cho người dùng
          // dử liệu: status, amount
          // status: trạng thái đơn hàng
          // amount: số tiền đã thanh toán

          socket.join(`BANK_${order_id}`)
          await writeInfoLog(`Khách hàng ${user._id} (SocketID: ${socket.id}) đã kết nối đến phòng BANK_${order_id}`)
          console.log(
            `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mBANK_${order_id}\x1b[0m`
          )
        }
      } catch {
        console.log()
      }
    }
  })

  socket.on('disconnect', () => {
    console.log(
      `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã ngắt kết nối đến máy chủ \x1b[36m${process.env.TRADEMARK_NAME} ${port}\x1b[0m`
    )
  })
})

server.listen(port, async () => {
  await writeInfoLog(`Thời gian chạy máy chủ ${formatDateFull2(serverRunningTime)}`)
  console.log()
  console.log(`\x1b[33mThời gian chạy máy chủ \x1b[36m${formatDateFull2(serverRunningTime)}\x1b[0m`)
  console.log()
  await startBot()
  console.log()
  console.log(`\x1b[33mMáy chủ đang chạy trên port \x1b[36m${port}\x1b[0m`)
  console.log(`\x1b[33mTruy cập tại: \x1b[36m${process.env.APP_URL}/\x1b[0m`)
  console.log()
})

process.on('SIGINT', async () => {
  const date = new Date()
  console.log()
  console.log(`\x1b[33mMáy chủ đã ngừng hoạt động\x1b[0m`)
  console.log()
  await stopBot()
  await writeInfoLog(`Thời gian tắt máy chủ ${formatDateFull2(date)}`)
  console.log()
  console.log(`\x1b[33mThời gian tắt máy chủ \x1b[36m${formatDateFull2(date)}\x1b[0m`)
  console.log()
  process.exit(0)
})

export { io, runningTime }
