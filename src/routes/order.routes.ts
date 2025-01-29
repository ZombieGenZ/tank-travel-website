import express from 'express'
import { orderController } from '~/controllers/order.controllers'
import { authenticationValidator, customerAuthenticationValidator } from '~/middlewares/authentication.middlewares'
import { orderValidator, priceValidator, quantityValidator } from '~/middlewares/order.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Đặt một đơn hàng mới
 * Path: /api/order
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    bus_route_id: string,
 *    name: string,
 *    phone: string,
 *    quantity: number
 * }
 */
router.post(
  '/',
  authenticationValidator,
  customerAuthenticationValidator,
  orderValidator,
  quantityValidator,
  priceValidator,
  wrapRequestHandler(orderController)
)

export default router
