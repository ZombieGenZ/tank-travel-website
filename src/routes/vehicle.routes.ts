import express from 'express'
import {
  getVehicleType,
  getSeatType,
  createController,
  updateController,
  deleteController,
  getVehicleController,
  getVehiclePreviewController,
  findVehicleController,
  censorVehicleController,
  getVehicleListController
} from '~/controllers/vehicle.controllers'
const router = express.Router()
import multer from 'multer'
import path from 'path'
import {
  authenticateCreateValidator,
  permissionValidator,
  createValidator,
  setupCreateImage,
  updateValidator,
  vehicleIdValidator,
  getVehicleValidator,
  findVehicleValidator,
  censorVehicleValidator
} from '~/middlewares/vehicle.middlewares'
import {
  authenticationValidator,
  businessAuthenticationValidator,
  administratorAuthenticationValidator
} from '~/middlewares/authentication.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import fse from 'fs-extra'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/images/upload/vehicle/temporary'
    fse
      .ensureDir(uploadPath)
      .then(() => {
        cb(null, uploadPath)
      })
      .catch((err) => {
        cb(err, uploadPath)
      })
  },
  filename: (req, file, cb) => {
    const fileName = path.basename(file.originalname, path.extname(file.originalname))
    const fileExt = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${fileName}-${uniqueSuffix}${fileExt}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 30
  }
})

/*
 * Description: Lấy thông tin các loại phương tiện
 * Path: /api/vehicle/get-vehicle-type
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.get(
  '/get-vehicle-type',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getVehicleType)
)

/*
 * Description: Lấy thông tin các loại chổ ngồi
 * Path: /api/vehicle/get-seat-type
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.get('/get-seat-type', authenticationValidator, businessAuthenticationValidator, wrapRequestHandler(getSeatType))

/*
 * Description: Tạo một phương tiện mới
 * Path: /api/vehicle/create
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    vehicle_type: number,
 *    seat_type: number,
 *    seats: number,
 *    rules: string,
 *    amenities: string,
 *    license_plate: string,
 *    preview: [Files]
 * }
 */
router.post(
  '/create',
  upload.array('preview', 30),
  authenticateCreateValidator,
  permissionValidator,
  createValidator,
  setupCreateImage,
  wrapRequestHandler(createController)
)

/*
 * Description: Cập nhật thông tin cho một phương hiện có trên CSDL
 * Path: /api/vehicle/update
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    vehicle_id: string
 *    vehicle_type: number,
 *    seat_type: number,
 *    seats: number,
 *    rules: string,
 *    amenities: string,
 *    license_plate: string
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
 * Description: Xóa một phương tiện đã có trên CSDL
 * Path: /api/vehicle/delete
 * Method: DELETE
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    vehicle_id: string
 * }
 */
router.delete(
  '/delete',
  authenticationValidator,
  businessAuthenticationValidator,
  vehicleIdValidator,
  wrapRequestHandler(deleteController)
)

/*
 * Description: Lấy thông tin phương tiện đã có trên CSDL
 * Path: /api/vehicle/get-vehicle
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
  '/get-vehicle',
  authenticationValidator,
  businessAuthenticationValidator,
  getVehicleValidator,
  wrapRequestHandler(getVehicleController)
)

/*
 * Description: Lấy đường dẩn hình ảnh xem trước của phương tiện đã có trên máy chủ
 * Path: /api/vehicle/get-vehicle-preview
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    vehicle_id: string
 * }
 */
router.get(
  '/get-vehicle-preview',
  authenticationValidator,
  businessAuthenticationValidator,
  vehicleIdValidator,
  wrapRequestHandler(getVehiclePreviewController)
)

/*
 * Description: Tìm kiếm thông tin phương tiện đã có trên CSDL
 * Path: /api/vehicle/find-vehicle
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    current: number,
 *    keywords: string
 * }
 */
router.get(
  '/find-vehicle',
  authenticationValidator,
  businessAuthenticationValidator,
  getVehicleValidator,
  findVehicleValidator,
  wrapRequestHandler(findVehicleController)
)

/*
 * Description: Ra quyết định cấp phép hoặc từ chối cho một phương tiện đã có trên CSDL
 * Path: /api/vehicle/censor-vehicle
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    vehicle_id: string,
 *    decision: boolean
 * }
 */
router.put(
  '/censor-vehicle',
  authenticationValidator,
  administratorAuthenticationValidator,
  vehicleIdValidator,
  censorVehicleValidator,
  wrapRequestHandler(censorVehicleController)
)

/*
 * Description: Lấy tấ cả các thông tin số hiệu và id của các phương tiện đã có trên CSDL
 * Path: /api/vehicle/get-vehicle-list
 * Method: GET
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.get(
  '/get-vehicle-list',
  authenticationValidator,
  businessAuthenticationValidator,
  wrapRequestHandler(getVehicleListController)
)

export default router
