import express from 'express'
import {
  getAccountController,
  findAccountController,
  banAccountController,
  unBanAccountController,
  sendNotificationController
} from '~/controllers/accountManagement.controllers'
import {
  getAccountValidator,
  findAccountValidator,
  banAccountValidator,
  unBanAccountValidator,
  sendNotificationValidator
} from '~/middlewares/accountManagement.middlewares'
import { authenticationValidator, administratorAuthenticationValidator } from '~/middlewares/authentication.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Lấy danh sách tất cả tài khoản có trong CSDL
 * Path: /api/account-management/get-account
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    current: number
 * }
 */

router.get(
  '/get-account',
  authenticationValidator,
  administratorAuthenticationValidator,
  getAccountValidator,
  wrapRequestHandler(getAccountController)
)

/*
 * Description: Tìm kiếm tài khoản có trong CSDL
 * Path: /api/account-management/find-account
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    keywords: string,
 *    current: number
 * }
 */

router.get(
  '/find-account',
  authenticationValidator,
  administratorAuthenticationValidator,
  findAccountValidator,
  wrapRequestHandler(findAccountController)
)

/*
 * Description: Khóa tài khoản có trong CSDL
 * Path: /api/account-management/ban-account
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    user_id: string,
 *    reason: string
 *    expired_at: Date
 * }
 */

router.put(
  '/ban-account',
  authenticationValidator,
  administratorAuthenticationValidator,
  banAccountValidator,
  wrapRequestHandler(banAccountController)
)

/*
 * Description: Mở khóa tài khoản có trong CSDL
 * Path: /api/account-management/unban-account
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    user_id: string
 * }
 */

router.put(
  '/unban-account',
  authenticationValidator,
  administratorAuthenticationValidator,
  unBanAccountValidator,
  wrapRequestHandler(unBanAccountController)
)

/*
 * Description: Gửi thông báo cho tài khoản có trong CSDL
 * Path: /api/account-management/send-notification
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    user_id: string,
 *    message: string
 * }
 */

router.post(
  '/send-notification',
  authenticationValidator,
  administratorAuthenticationValidator,
  sendNotificationValidator,
  wrapRequestHandler(sendNotificationController)
)

export default router
