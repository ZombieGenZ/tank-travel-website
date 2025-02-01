import express from 'express'
import {
  registerController,
  loginController,
  logoutController,
  sendEmailController,
  reSendEmailController,
  sendEmailForgotPasswordController,
  forgotPasswordController,
  changePasswordController,
  sendEmailVerifyController,
  reSendEmailVerifyController,
  changeEmailController
} from '~/controllers/user.controllers'
import { authenticationValidator } from '~/middlewares/authentication.middlewares'
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  sendEmailVerifyValidator,
  reSendEmailVerifyValidator,
  sendEmailForgotPasswordValidator,
  forgotPasswordValidator,
  changePasswordValidator,
  changeEmailValidator
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
 * Method: PUT
 * Body: {
 *    email: string
 * }
 */
router.put('/resend-email-verify', reSendEmailVerifyValidator, wrapRequestHandler(reSendEmailController))

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
 * Path: /api/users/login
 * Method: POST
 * Body: {
 *    email: string,
 *    password: string
 * }
 */
router.post('/login', loginValidator, wrapRequestHandler(loginController))

/*
 * Description: Đăng xuất khỏi một tài khoản hiện có trên CSDL
 * Path: /api/users/logout
 * Method: DELETE
 * Body: {
 *    refresh_token: string
 * }
 */
router.delete('/logout', refreshTokenValidator, wrapRequestHandler(logoutController))

/*
 * Description: Gửi email quên mật khẩu cho một tài khoản có trong CSDL
 * Path: /api/users/send-email-forgot-password
 * Method: POST
 * Body: {
 *    email: string
 * }
 */
router.post(
  '/send-email-forgot-password',
  sendEmailForgotPasswordValidator,
  wrapRequestHandler(sendEmailForgotPasswordController)
)

/*
 * Description: Sử dụng token để lấy lại mật khẩu cho một tài khoản có trong CSDL
 * Path: /api/users/forgot-password
 * Method: POST
 * Body: {
 *    token: string,
 *    new_password: string,
 *    comform_new_password: string
 * }
 */
router.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/*
 * Description: Thay đổi mật khẩu cho một tài khoản có trong CSDL
 * Path: /api/users/change-password
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    password: string,
 *    new_password: string,
 *    comform_new_password: string
 * }
 */
router.put(
  '/change-password',
  authenticationValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

/*
 * Description: Gữi mã xác nhận thay đổi email cho một tài khoản có trong CSDL
 * Path: /api/users/send-email-verify-change-email
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    email: string
 * }
 */
router.post(
  '/send-email-verify-change-email',
  authenticationValidator,
  sendEmailVerifyValidator,
  wrapRequestHandler(sendEmailVerifyController)
)

/*
 * Description: Gữi lại mã xác nhận thay đổi email cho một tài khoản có trong CSDL
 * Path: /api/users/resend-email-verify-change-email
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    email: string
 * }
 */
router.put(
  '/resend-email-verify-change-email',
  authenticationValidator,
  reSendEmailVerifyValidator,
  wrapRequestHandler(reSendEmailVerifyController)
)

/*
 * Description: Thay đổi email cho một tài khoản có trong CSDL
 * Path: /api/users/change-email
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    new_email: string,
 *    email_verify_code: string
 * }
 */
router.put('/change-email', authenticationValidator, changeEmailValidator, wrapRequestHandler(changeEmailController))

// DOITAFTER: Làm chức năng thay đổi số điện thoại
// DOITAFTER: Làm chức năng thay đổi thay đổi avatar

export default router
