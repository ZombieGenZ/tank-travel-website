import express from 'express'
import {
  registerValidator,
  censorValidator,
  getBusinessRegistrationValidator
} from '~/middlewares/businessRegistration.middlewares'
import {
  registerController,
  censorController,
  getBusinessRegistrationController
} from '~/controllers/businessRegistration.controllers'
import { wrapRequestHandler } from '~/utils/handlers'
import { administratorAuthenticationValidator, authenticationValidator } from '~/middlewares/authentication.middlewares'
const router = express.Router()

/*
 * Description: Đăng ký doanh nghiệp
 * Path: /api/business-registration/register
 * Method: POST
 * Body: {
 *    name: string,
 *    email: string,
 *    phone: string,
 *    have_account: boolean
 * }
 */
router.post('/register', registerValidator, wrapRequestHandler(registerController))

/*
 * Description: Kiểm duyệt đăng ký doanh nghiệp
 * Path: /api/business-registration/censor
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    business_registration_id: string,
 *    decision: boolean
 * }
 */
router.put(
  '/censor',
  authenticationValidator,
  administratorAuthenticationValidator,
  censorValidator,
  wrapRequestHandler(censorController)
)

/*
 * Description: Lấy thông tin doanh nghiệp đã đăng ký
 * Path: /api/business-registration/get-business-registration
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
  '/get-business-registration',
  authenticationValidator,
  administratorAuthenticationValidator,
  getBusinessRegistrationValidator,
  wrapRequestHandler(getBusinessRegistrationController)
)

export default router
