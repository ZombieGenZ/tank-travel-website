import express, { Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 3000

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World!' })
})

app.listen(port, () => {
  console.log()
  console.log(`\x1b[33mMáy chủ đang chạy trên port \x1b[36m${port}\x1b[0m`)
  console.log(`\x1b[33mTruy cập tại: \x1b[36m${process.env.WEBSITE_URL}/\x1b[0m`)
  console.log()
})
