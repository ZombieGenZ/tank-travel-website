import express from 'express'
import { authenticationController } from '~/controllers/authentication.controllers'
import { authenticationValidator } from '~/middlewares/authentication.middlewares'
const router = express.Router()

router.get('/', authenticationValidator, authenticationController)

export default router
