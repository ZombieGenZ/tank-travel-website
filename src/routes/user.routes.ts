import express from 'express'
import { registerController, loginController, logoutController } from '~/controllers/user.controllers'
import {
  registerValidator,
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator
} from '~/middlewares/user.middlewares'
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

/*
 * Description: Đăng nhập vào một tài khoản hiện có trên CSDL
 * Path: /users/login
 * Method: POST
 * Body: {
 *    email: string,
 *    password: string
 * }
 */
router.post('/login', loginValidator, wrapRequestHandler(loginController))

/*
 * Description: Đăng xuất khỏi một tài khoản hiện có trên CSDL
 * Path: /users/logout
 * Method: POST
 * headers: {
 *   Authorization: Bearer <access_token>
 * }
 * Body: {
 *    refresh_token: string
 * }
 */
router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

export default router
