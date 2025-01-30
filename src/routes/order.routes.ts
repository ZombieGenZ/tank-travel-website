import express from 'express'
import {
  getOrderController,
  orderController,
  getOrderDetailListController,
  getOrderListController
} from '~/controllers/order.controllers'
import {
  authenticationValidator,
  customerAuthenticationValidator,
  businessAuthenticationValidator
} from '~/middlewares/authentication.middlewares'
import {
  getOrderDetailValidator,
  getOrderValidator,
  orderValidator,
  priceValidator,
  quantityValidator
} from '~/middlewares/order.middlewares'
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

/*
 * Description: Lấy thông tin các đơn hàng của một khách hàng
 * Path: /api/order/get-order-list
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
  '/get-order-list',
  authenticationValidator,
  customerAuthenticationValidator,
  getOrderValidator,
  wrapRequestHandler(getOrderListController)
)

/*
 * Description: Lấy thông tin chi tiết của một đơn hàng
 * Path: /api/order/get-order-detail-list
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    order_id: string,
 *    current: number
 * }
 */
router.get(
  '/get-order-detail-list',
  authenticationValidator,
  customerAuthenticationValidator,
  getOrderDetailValidator,
  wrapRequestHandler(getOrderDetailListController)
)

/*
 * Description: Lấy thông tin các đơn đặt hàng có trong CSDL
 * Path: /api/order/get-order
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
  '/get-order',
  authenticationValidator,
  businessAuthenticationValidator,
  getOrderValidator,
  wrapRequestHandler(getOrderController)
)

export default router
