import express from 'express'
import { geNotificationController } from '~/controllers/notification-priate.controllers'
import { authenticationValidator } from '~/middlewares/authentication.middlewares'
import { getNotificationPrivateValidator } from '~/middlewares/notification-priate.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Lấy các thông báo của người dùng
 * Path: /api/notification-private/get-notification
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    session_time: Date,
 *    current: number
 * }
 */
router.post(
  '/get-notification',
  authenticationValidator,
  getNotificationPrivateValidator,
  wrapRequestHandler(geNotificationController)
)

export default router
