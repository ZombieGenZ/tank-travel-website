import express, { Request, Response, NextFunction } from 'express'
import { db } from '~/services/firebase.services'
import { io } from '../index'
const router = express.Router()

router.get('/vehicle/create', (req: Request, res: Response) => {
  res.render('test/vehicle.create.ejs')
})

router.post('/chat', async (req: Request, res: Response) => {
  const room = '/test/go-chat'
  const { message } = req.body

  const ref = db.ref(`messages${room}`).push()
  await ref.set({ message, timestamp: Date.now() })

  io.to(room).emit('new-message', { message, room })

  res.json({ success: true })
})

router.get('/go-chat', async (req: Request, res: Response) => {
  res.render('test/test.chat.ejs', { host: process.env.APP_URL })
})

router.get('/balance', async (req: Request, res: Response) => {
  res.render('test/test.balance.ejs', { host: process.env.APP_URL })
})

router.get('/revenue', async (req: Request, res: Response) => {
  res.render('test/test.revenue.ejs', { host: process.env.APP_URL })
})

router.get('/log', async (req: Request, res: Response) => {
  res.render('test/test.log.ejs', { host: process.env.APP_URL })
})

export default router
