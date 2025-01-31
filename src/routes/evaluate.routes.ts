import express from 'express'
import { createEvaluateController } from '~/controllers/evaluate.controllers'
import { authenticationValidator, customerAuthenticationValidator } from '~/middlewares/authentication.middlewares'
import { createValidator } from '~/middlewares/evaluate.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Tạo một đánh giá chi phương tiện
 * Path: /api/evaluate/create
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    vehicle_id: string,
 *    rating: number,
 *    content: string
 * }
 */
router.post(
  '/create',
  authenticationValidator,
  customerAuthenticationValidator,
  createValidator,
  wrapRequestHandler(createEvaluateController)
)

export default router
