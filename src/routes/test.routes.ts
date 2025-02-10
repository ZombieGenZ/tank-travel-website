import express, { Request, Response, NextFunction } from 'express'
import { db } from '~/services/firebase.services'
import { io } from '../index'
import axios from 'axios'
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

router.get('/notificaton', async (req: Request, res: Response) => {
  res.render('test/test.notificaton.ejs', { host: process.env.APP_URL })
})

router.get('/verify-email', async (req: Request, res: Response) => {
  axios
    .get(
      'https://api.hunter.io/v2/email-verifier?email=zombiegenzzz@gmail.com&api_key=6562539c3ae740fafe8384b18639a6007ef0c015'
    )
    .then((response) => {
      res.json(response.data)
    })
})

export default router
