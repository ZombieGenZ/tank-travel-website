import express from 'express'
import {
  getOrderController,
  orderController,
  getOrderDetailListController,
  getOrderListController,
  cancelTicketController
} from '~/controllers/order.controllers'
import {
  authenticationValidator,
  customerAuthenticationValidator,
  businessAuthenticationValidator
} from '~/middlewares/authentication.middlewares'
import {
  orderValidator,
  priceValidator,
  quantityValidator,
  getOrderValidator,
  getOrderDetailValidator,
  cancelTicketValidator
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
 *    session_time: Date,
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
 *    session_time: Date,
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

/*
 * Description: Hũy vé của một đơn hàng
 * Path: /api/order/cancel-ticket
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    ticket_id: string
 * }
 */
router.put(
  '/cancel-ticket',
  authenticationValidator,
  customerAuthenticationValidator,
  cancelTicketValidator,
  wrapRequestHandler(cancelTicketController)
)

export default router
