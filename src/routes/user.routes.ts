import express from 'express'
import {
  registerController,
  loginController,
  logoutController,
  sendEmailController,
  reSendEmailController
} from '~/controllers/user.controllers'
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  emailVerifyTokenValidator,
  sendEmailVerifyValidator,
  reSendEmailVerifyValidator
} from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Gửi email xác thực tài khoản
 * Path: /api/users/send-email-verify
 * Method: POST
 * Body: {
 *    email: string
 * }
 */
router.post('/send-email-verify', sendEmailVerifyValidator, wrapRequestHandler(sendEmailController))

/*
 * Description: Gửi lại email xác thực tài khoản
 * Path: /api/users/resend-email-verify
 * Method: POST
 * Body: {
 *    email: string
 * }
 */
router.post('/resend-email-verify', reSendEmailVerifyValidator, wrapRequestHandler(reSendEmailController))

/*
 * Description: Tạo một tài khoản mới
 * Path: /api/users/register
 * Method: POST
 * Body: {
 *    display_name: string,
 *    email: string,
 *    phone: string,
 *    password: string,
 *    comfirm_password: string,
 *    email_verify_code: string
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
 * Body: {
 *    refresh_token: string
 * }
 */
router.post('/logout', refreshTokenValidator, wrapRequestHandler(logoutController))

export default router
