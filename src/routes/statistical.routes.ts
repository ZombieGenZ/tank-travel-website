import express from 'express'
import {
  getRevenueStatisticsController,
  findRevenueStatisticsController,
  getOrderStatisticsController,
  findOrderStatisticsController,
  getDealtatisticsController,
  findDealStatisticsController,
  getChartRevenueStatisticsController,
  getTopRevenueStatisticsController,
  getCompareDealsStatisticsController,
  getCompaRerevenueStatisticsController,
  getCompaTicketStatisticsController,
  getTodayStatisticsController
} from '~/controllers/statistical.controllers'
import { authenticationValidator, businessAuthenticationValidator } from '~/middlewares/authentication.middlewares'
import { findStatisticalValidator } from '~/middlewares/statistical.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Lấy thống kê doanh thu (lấy trong ngày)
 * Path: /api/statistical/get-revenue-statistics
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.post(
  '/get-revenue-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getRevenueStatisticsController)
)

/*
 * Description: Lấy thống kê doanh thu (Lấy theo khoản thời gian)
 * Path: /api/statistical/find-revenue-statistics
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    start_time: Date,
 *    end_time: Date
 * }
 */
router.post(
  '/find-revenue-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  findStatisticalValidator,
  wrapRequestHandler(findRevenueStatisticsController)
)

/*
 * Description: Lấy thống kê số vé đã đặt (lấy trong ngày)
 * Path: /api/statistical/get-order-statistics
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.post(
  '/get-order-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getOrderStatisticsController)
)

/*
 * Description: Lấy thống kê số vé đã đặt (Lấy theo khoản thời gian)
 * Path: /api/statistical/find-order-statistics
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    start_time: Date,
 *    end_time: Date
 * }
 */
router.post(
  '/find-order-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  findStatisticalValidator,
  wrapRequestHandler(findOrderStatisticsController)
)

/*
 * Description: Lấy thống kê số đơn đã đặt (lấy trong ngày)
 * Path: /api/statistical/get-deal-statistics
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.post(
  '/get-deal-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getDealtatisticsController)
)

/*
 * Description: Lấy thống kê số đơn đã đặt (Lấy theo khoản thời gian)
 * Path: /api/statistical/find-deal-statistics
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    start_time: Date,
 *    end_time: Date
 * }
 */
router.post(
  '/find-deal-statistics',
  authenticationValidator,
  businessAuthenticationValidator,
  findStatisticalValidator,
  wrapRequestHandler(findDealStatisticsController)
)

/*
 * Description: Lấy thông tin thống kê doanh thu dưới dạn biểu đồ
 * Path: /api/statistical/chart/revenue
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.post(
  '/chart/revenue',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getChartRevenueStatisticsController)
)

/*
 * Description: Top doanh thu theo 7 ngày gần nhất
 * Path: /api/statistical/top/revenue
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.post(
  '/top/revenue',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getTopRevenueStatisticsController)
)

/*
 * Description: Lấy % thay đổi số đơn hàng của ngày hôm nay và ngày hôm qua
 * Path: /api/statistical/compare/deals
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.post(
  '/compare/deals',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getCompareDealsStatisticsController)
)

/*
 * Description: Lấy % thay đổi số doanh thu của ngày hôm nay và ngày hôm qua
 * Path: /api/statistical/compare/revenue
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.post(
  '/compare/revenue',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getCompaRerevenueStatisticsController)
)

/*
 * Description: Lấy % thay đổi số đơn hàng của ngày hôm nay và ngày hôm qua
 * Path: /api/statistical/compare/ticket
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.post(
  '/compare/ticket',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getCompaTicketStatisticsController)
)

/*
 * Description: Lấy số đơn hàng, số vé đã bán và số doanh thu trong ngày
 * Path: /api/statistical/overview
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.post(
  '/overview',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getTodayStatisticsController)
)

export default router
