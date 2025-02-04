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
  changeEmailController,
  changePhoneController,
  changeAvatarController,
  setDefaultAvatarController,
  changePasswordTemporaryController
} from '~/controllers/user.controllers'
import { authenticationValidator } from '~/middlewares/authentication.middlewares'
import {
  registerValidator,
  checkTemporaryAccountValidator,
  loginValidator,
  refreshTokenValidator,
  sendEmailVerifyValidator,
  reSendEmailVerifyValidator,
  sendEmailForgotPasswordValidator,
  forgotPasswordValidator,
  changePasswordValidator,
  changeEmailValidator,
  changePhoneValidator,
  AuthenticationValidator,
  image3x4Validator,
  changePasswordTemporaryValidator
} from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import multer from 'multer'
import path from 'path'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/images/upload/avatar/temporary`)
  },
  filename: (req, file, cb) => {
    const fileName = path.basename(file.originalname, path.extname(file.originalname))
    const fileExt = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${fileName}-${uniqueSuffix}${fileExt}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1
  }
})

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
router.post('/login', loginValidator, checkTemporaryAccountValidator, wrapRequestHandler(loginController))

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

/*
 * Description: Thay đổi số điện thoại cho một tài khoản có trong CSDL
 * Path: /api/users/change-phone
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    new_phone: string
 * }
 */
router.put('/change-phone', authenticationValidator, changePhoneValidator, wrapRequestHandler(changePhoneController))

/*
 * Description: Thay đổi ảnh đại diện cho một tài khoản có trong CSDL
 * Path: /api/users/change-avatar
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    new_avatar: file
 * }
 */
router.put(
  '/change-avatar',
  upload.single('new_avatar'),
  AuthenticationValidator,
  image3x4Validator,
  wrapRequestHandler(changeAvatarController)
)

/*
 * Description: Thay đổi ảnh đại diện về mặc định cho một tài khoản có trong CSDL
 * Path: /api/users/set-default-avatar
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.put('/set-default-avatar', authenticationValidator, wrapRequestHandler(setDefaultAvatarController))

/*
 * Description: Đổi mật khẩu cho lần đầu đăng nhập của tài khoản doanh nghiệp được cấp bởi quản trị viên
 * Path: /api/users/change-password-temporary
 * Method: PUT
 * Body: {
 *    email: string,
 *    password: string,
 *    new_password: string,
 *    comform_new_password: string
 * }
 */
router.put(
  '/change-password-temporary',
  changePasswordTemporaryValidator,
  wrapRequestHandler(changePasswordTemporaryController)
)

export default router
