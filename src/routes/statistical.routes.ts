import express from 'express'
import {
  getRevenueStatisticsController,
  findRevenueStatisticsController,
  getOrderStatisticsController,
  findOrderStatisticsController
} from '~/controllers/statistical.controllers'
import { authenticationValidator, businessAuthenticationValidator } from '~/middlewares/authentication.middlewares'
import { findStatisticalValidator } from '~/middlewares/statistical.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Lấy thống kê doanh thu (lấy trong ngày)
 * Path: /api/statistical/get-revenue-statistics
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.get(
  '/get-revenue-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getRevenueStatisticsController)
)

/*
 * Description: Lấy thống kê doanh thu (Lấy theo khoản thời gian)
 * Path: /api/statistical/find-revenue-statistics
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    start_time: Date,
 *    end_time: Date
 * }
 */
router.get(
  '/find-revenue-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  findStatisticalValidator,
  wrapRequestHandler(findRevenueStatisticsController)
)

/*
 * Description: Lấy thống kê số vé đã đặt (lấy trong ngày)
 * Path: /api/statistical/get-order-statistics
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.get(
  '/get-order-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getOrderStatisticsController)
)

/*
 * Description: Lấy thống kê số vé đã đặt (Lấy theo khoản thời gian)
 * Path: /api/statistical/find-order-statistics
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    start_time: Date,
 *    end_time: Date
 * }
 */
router.get(
  '/find-order-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  findStatisticalValidator,
  wrapRequestHandler(findOrderStatisticsController)
)

export default router
