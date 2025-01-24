import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

dotenv.config()
const port = process.env.APP_PORT || 3000

import userApi from '~/routes/user.routes'

const app = express()

app.use(express.json())

databaseService.connect()

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' })
})

app.use('/users', userApi)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log()
  console.log(`\x1b[33mMáy chủ đang chạy trên port \x1b[36m${port}\x1b[0m`)
  console.log(`\x1b[33mTruy cập tại: \x1b[36m${process.env.APP_URL}/\x1b[0m`)
  console.log()
})
