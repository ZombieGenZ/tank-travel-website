import express from 'express'
import {
  createController,
  updateController,
  deleteController,
  getBusRouteController,
  findBusRouteController,
  getBusRouteListController,
  findBusRouteListController
} from '~/controllers/busRoute.controllers'
import { authenticationValidator, businessAuthenticationValidator } from '~/middlewares/authentication.middlewares'
import {
  createValidator,
  updateValidator,
  deleteValidator,
  getBusRouteValidator,
  findBusRouteValidator,
  getBusRouteListValidator,
  findBusRouteListValidator
} from '~/middlewares/busRoute.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

/*
 * Description: Tạo một tuyến mới
 * Path: /api/bus-route/create
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    vehicle_id: string,
 *    start_point: string,
 *    end_point: string,
 *    departure_time: Date,
 *    arrival_time: Date,
 *    price: number,
 *    quantity: number
 * }
 */
router.post(
  '/create',
  authenticationValidator,
  businessAuthenticationValidator,
  createValidator,
  wrapRequestHandler(createController)
)

/*
 * Description: Sửa một tuyến đã có trên CSDL
 * Path: /api/bus-route/update
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    bus_route_id: string,
 *    vehicle_id: string,
 *    start_point: string,
 *    end_point: string,
 *    departure_time: Date,
 *    arrival_time: Date,
 *    price: number,
 *    quantity: number
 * }
 */
router.put(
  '/update',
  authenticationValidator,
  businessAuthenticationValidator,
  updateValidator,
  wrapRequestHandler(updateController)
)

/*
 * Description: Xóa một tuyến đã có trên CSDL
 * Path: /api/bus-route/delete
 * Method: DELETE
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    bus_route_id: string
 * }
 */
router.delete(
  '/delete',
  authenticationValidator,
  businessAuthenticationValidator,
  deleteValidator,
  wrapRequestHandler(deleteController)
)

/*
 * Description: Lấy thông tin các tuyến đã có trên CSDL
 * Path: /api/bus-route/get-bus-route
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
  '/get-bus-route',
  authenticationValidator,
  businessAuthenticationValidator,
  getBusRouteValidator,
  wrapRequestHandler(getBusRouteController)
)

/*
 * Description: Tìm kiếm thông tin các tuyến đã có trên CSDL
 * Path: /api/bus-route/find-bus-route
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    session_time: Date,
 *    current: number,
 *    keywords: string
 * }
 */
router.post(
  '/find-bus-route',
  authenticationValidator,
  businessAuthenticationValidator,
  findBusRouteValidator,
  wrapRequestHandler(findBusRouteController)
)

/*
 * Description: Lấy thông tin các tuyến đã có trên CSDL
 * Path: /api/bus-route/get-bus-route-list
 * Method: POST
 * Body: {
 *    session_time: Date,
 *    current: number
 * }
 */
router.post('/get-bus-route-list', getBusRouteListValidator, wrapRequestHandler(getBusRouteListController))

/*
 * Description: Tìm kiếm thông tin các tuyến đã có trên CSDL
 * Path: /api/bus-route/find-bus-route-list
 * Method: POST
 * Body: {
 *    session_time: Date,
 *    vehicle_type: number,
 *    start_point: string,
 *    end_point: string,
 *    departure_time: Date,
 *    current: number
 * }
 */
router.post('/find-bus-route-list', findBusRouteListValidator, wrapRequestHandler(findBusRouteListController))

export default router
