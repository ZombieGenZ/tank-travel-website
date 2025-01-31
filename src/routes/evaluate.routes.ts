import express from 'express'
import {
  createEvaluateController,
  updateEvaluateController,
  deleteEvaluateController
} from '~/controllers/evaluate.controllers'
import {
  authenticationValidator,
  customerAuthenticationValidator,
  administratorAuthenticationValidator
} from '~/middlewares/authentication.middlewares'
import { createValidator, updateValidator, deleteValidator } from '~/middlewares/evaluate.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Tạo một đánh giá cho phương tiện
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

/*
 * Description: Sửa một đánh giá có trong CSDL
 * Path: /api/evaluate/update
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    evaluate_id: string,
 *    rating: number,
 *    content: string
 * }
 */
router.put(
  '/update',
  authenticationValidator,
  customerAuthenticationValidator,
  updateValidator,
  wrapRequestHandler(updateEvaluateController)
)

/*
 * Description: Xóa một đánh giá có trong CSDL
 * Path: /api/evaluate/delete
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    evaluate_id: string
 * }
 */
router.delete(
  '/delete',
  authenticationValidator,
  administratorAuthenticationValidator,
  deleteValidator,
  wrapRequestHandler(deleteEvaluateController)
)

export default router
