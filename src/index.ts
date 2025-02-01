import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

dotenv.config()
const port = process.env.APP_PORT || 3000

import userApi from '~/routes/user.routes'
import vehicleApi from '~/routes/vehicle.routes'
import busRouteApi from '~/routes/busRoute.routes'
import orderApi from '~/routes/order.routes'
import evaluateApi from '~/routes/evaluate.routes'

const app = express()

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

app.get('/test/vehicle/create', (req: Request, res: Response) => {
  res.render('test/vehicle.create.ejs')
})

app.use('/api/users', userApi)
app.use('/api/vehicle', vehicleApi)
app.use('/api/bus-route', busRouteApi)
app.use('/api/order', orderApi)
app.use('/api/evaluate', evaluateApi)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log()
  console.log(`\x1b[33mMáy chủ đang chạy trên port \x1b[36m${port}\x1b[0m`)
  console.log(`\x1b[33mTruy cập tại: \x1b[36m${process.env.APP_URL}/\x1b[0m`)
  console.log()
})
