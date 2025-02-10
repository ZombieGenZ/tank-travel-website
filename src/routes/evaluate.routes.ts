import express from 'express'
import {
  createEvaluateController,
  updateEvaluateController,
  deleteEvaluateController,
  getEvaluateController,
  createFeedbackController,
  updateFeedbackController,
  deleteFeedbackController,
  getEvaluateListController
} from '~/controllers/evaluate.controllers'
import {
  authenticationValidator,
  customerAuthenticationValidator,
  businessAuthenticationValidator,
  administratorAuthenticationValidator
} from '~/middlewares/authentication.middlewares'
import {
  createValidator,
  updateValidator,
  deleteValidator,
  getEvaluateValidator,
  createFeedbackValidator,
  updateFeedbackValidator,
  deleteFeedbackValidator,
  getEvaluateListValidator
} from '~/middlewares/evaluate.middlewares'
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
 * Method: DELETE
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

/*
 * Description: Lấy danh sách đánh giá
 * Path: /api/evaluate/get-evaluate
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
  '/get-evaluate',
  authenticationValidator,
  businessAuthenticationValidator,
  getEvaluateValidator,
  wrapRequestHandler(getEvaluateController)
)

/*
 * Description: Tạo phản hồi cho một đánh giá có trong CSDL
 * Path: /api/evaluate/create-feedback
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    evaluate_id: string,
 *    content: string
 * }
 */
router.post(
  '/create-feedback',
  authenticationValidator,
  businessAuthenticationValidator,
  createFeedbackValidator,
  wrapRequestHandler(createFeedbackController)
)

/*
 * Description: Sửa phản hồi cho một đánh giá có trong CSDL
 * Path: /api/evaluate/update-feedback
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    evaluate_id: string,
 *    content: string
 * }
 */
router.put(
  '/update-feedback',
  authenticationValidator,
  businessAuthenticationValidator,
  updateFeedbackValidator,
  wrapRequestHandler(updateFeedbackController)
)

/*
 * Description: Xóa phản hồi cho một đánh giá có trong CSDL
 * Path: /api/evaluate/delete-feedback
 * Method: DELETE
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    evaluate_id: string
 * }
 */
router.delete(
  '/delete-feedback',
  authenticationValidator,
  administratorAuthenticationValidator,
  deleteFeedbackValidator,
  wrapRequestHandler(deleteFeedbackController)
)

/*
 * Description: Lấy danh sách đánh giá của một phương tiện có trong CSDL
 * Path: /api/evaluate/get-evaluate-list
 * Method: GET
 * Body: {
 *    session_time: Date,
 *    vehicle_id: string,
 *    current: number
 * }
 */
router.get('/get-evaluate-list', getEvaluateListValidator, wrapRequestHandler(getEvaluateListController))

export default router
