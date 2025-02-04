import express from 'express'
import { downloadAppController } from '~/controllers/download.controllers'
const router = express.Router()

router.get('/app', downloadAppController)

export default router
