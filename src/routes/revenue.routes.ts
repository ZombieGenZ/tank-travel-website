import express from 'express'
import { createBankOrderController, checkoutBankOrderController } from '~/controllers/revenue.controllers'
import { authenticationValidator } from '~/middlewares/authentication.middlewares'
import { createBankOrderValidator, sepayApiKeyValidator } from '~/middlewares/revenue.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Tạo đơn hàng mới cho khách hàng
 * Path: /api/revenue/create-bank-order
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    amount: number
 * }
 */
router.post(
  '/create-bank-order',
  authenticationValidator,
  createBankOrderValidator,
  wrapRequestHandler(createBankOrderController)
)

/*
 * Description: Endpoint để Sepay phản hồi kết quả thanh toán cho hệ thống
 * Path: /api/revenue/checkout-bank-order
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    id: number,
 *    gateway: string,
 *    transactionDate: string,
 *    accountNumber: string,
 *    code: string | null,
 *    content: string,
 *    transferType: string,
 *    transferAmount: number,
 *    accumulated: number,
 *    subAccount: number | null,
 *    referenceCode: string,
 *    description: string
 * }
 */
router.post('/checkout-bank-order', sepayApiKeyValidator, wrapRequestHandler(checkoutBankOrderController))

export default router
