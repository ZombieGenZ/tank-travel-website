import express from 'express'
import { registerController } from '~/controllers/user.controllers'
import { registerValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Tạo một tài khoản mới
 * Path: /users/register
 * Method: POST
 * Body: {
 *    display_name: string,
 *    email: string,
 *    phone: string,
 *    password: string,
 *    comfirm_password: string
 * }
 */
router.post('/register', registerValidator, wrapRequestHandler(registerController))

export default router
